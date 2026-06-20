(function () {
  "use strict";

  var encoder = new TextEncoder();
  var decoder = new TextDecoder();

  function bytesFromBase64(value) {
    var binary = atob(value);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function readStoredPassword(key) {
    try {
      return sessionStorage.getItem("hugo-encrypt:" + key) || "";
    } catch (error) {
      return "";
    }
  }

  function storePassword(key, password) {
    try {
      sessionStorage.setItem("hugo-encrypt:" + key, password);
    } catch (error) {
      // Ignore private browsing and disabled storage.
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  async function decrypt(payload, password) {
    var keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    var key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: bytesFromBase64(payload.salt),
        iterations: payload.iterations
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    var plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: bytesFromBase64(payload.iv)
      },
      key,
      bytesFromBase64(payload.ciphertext)
    );
    return decoder.decode(plaintext);
  }

  function headingId(heading) {
    var anchor = heading.querySelector(".anchor[id]");
    return anchor ? anchor.id : heading.id;
  }

  function buildTocList(headings) {
    var root = document.createElement("ul");
    var stack = [{ level: 0, list: root, item: null }];

    headings.forEach(function (heading) {
      var id = headingId(heading);
      if (!id) return;

      var level = Number(heading.tagName.slice(1));
      var text = heading.cloneNode(true);
      text.querySelectorAll(".anchor, span").forEach(function (node) {
        node.remove();
      });

      while (stack.length > 1 && level <= stack[stack.length - 1].level) {
        stack.pop();
      }

      var parent = stack[stack.length - 1];
      var targetList = parent.list;
      if (parent.item) {
        targetList = parent.item.querySelector(":scope > ul");
        if (!targetList) {
          targetList = document.createElement("ul");
          parent.item.appendChild(targetList);
        }
      }

      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + id;
      link.textContent = text.textContent.trim();
      item.appendChild(link);
      targetList.appendChild(item);
      stack.push({ level: level, list: targetList, item: item });
    });

    return root;
  }

  function buildArticleToc(box) {
    var articleContent = box.closest(".article-content");
    var contentColumn = articleContent && articleContent.parentElement;
    var section = contentColumn && contentColumn.parentElement;
    if (!articleContent || !contentColumn || !section || section.querySelector(".hugo-encrypt-toc")) {
      return;
    }

    var headings = Array.prototype.slice.call(articleContent.querySelectorAll("h1, h2, h3, h4, h5, h6"))
      .filter(function (heading) {
        return headingId(heading);
      });
    if (!headings.length) {
      return;
    }

    var wrapper = document.createElement("div");
    wrapper.className = "hugo-encrypt-toc order-first lg:ml-auto px-0 lg:order-last ltr:lg:pl-8 rtl:lg:pr-8";
    wrapper.innerHTML = [
      '<div class="toc ltr:pl-5 rtl:pr-5 print:hidden lg:sticky lg:top-[140px]">',
      '<details open id="TOCView" class="toc-right mt-0 overflow-y-scroll overscroll-contain scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600 rounded-lg ltr:-ml-5 ltr:pl-5 rtl:-mr-5 rtl:pr-5 hidden lg:block">',
      '<summary class="block py-1 text-lg font-semibold cursor-pointer bg-neutral-100 text-neutral-800 ltr:-ml-5 ltr:pl-5 rtl:-mr-5 rtl:pr-5 dark:bg-neutral-700 dark:text-neutral-100 lg:hidden">目录</summary>',
      '<div class="min-w-[220px] py-2 border-dotted ltr:-ml-5 ltr:border-l ltr:pl-5 rtl:-mr-5 rtl:border-r rtl:pr-5 dark:border-neutral-600"><nav id="TableOfContents"></nav></div>',
      "</details>",
      '<details class="toc-inside mt-0 overflow-hidden rounded-lg ltr:-ml-5 ltr:pl-5 rtl:-mr-5 rtl:pr-5 lg:hidden">',
      '<summary class="py-1 text-lg font-semibold cursor-pointer bg-neutral-100 text-neutral-800 ltr:-ml-5 ltr:pl-5 rtl:-mr-5 rtl:pr-5 dark:bg-neutral-700 dark:text-neutral-100 lg:hidden">目录</summary>',
      '<div class="py-2 border-dotted border-neutral-300 ltr:-ml-5 ltr:border-l ltr:pl-5 rtl:-mr-5 rtl:border-r rtl:pr-5 dark:border-neutral-600"><nav></nav></div>',
      "</details>",
      "</div>"
    ].join("");

    var lists = wrapper.querySelectorAll("nav");
    lists[0].appendChild(buildTocList(headings));
    lists[1].appendChild(buildTocList(headings));
    section.insertBefore(wrapper, contentColumn);
    setupDynamicToc(wrapper, headings);
  }

  function linkTarget(link) {
    try {
      return decodeURIComponent(link.getAttribute("href").slice(1));
    } catch (error) {
      return link.getAttribute("href").slice(1);
    }
  }

  function setupDynamicToc(wrapper, headings) {
    var margin = 200;
    var marginError = 50;
    var tocRight = wrapper.querySelector("#TOCView");
    var links = Array.prototype.slice.call(wrapper.querySelectorAll('a[href^="#"]'));

    function resizeToc() {
      if (!tocRight) return;
      var maxHeight = window.innerHeight - margin;
      if (tocRight.scrollHeight >= maxHeight) {
        tocRight.style.overflowY = "scroll";
        tocRight.style.maxHeight = maxHeight + marginError + "px";
      } else {
        tocRight.style.overflowY = "hidden";
        tocRight.style.maxHeight = "9999999px";
      }
    }

    function updateActiveLink() {
      var current = "";
      var cutoff = window.innerHeight / 3;
      headings.forEach(function (heading) {
        if (heading.getBoundingClientRect().top <= cutoff) {
          current = headingId(heading);
        }
      });

      links.forEach(function (link) {
        if (linkTarget(link) === current) {
          link.classList.add("active");
          var parent = link.parentElement;
          while (parent && parent !== wrapper) {
            if (parent.tagName === "UL") {
              parent.style.display = "";
            }
            parent = parent.parentElement;
          }
        } else {
          link.classList.remove("active");
        }
      });
    }

    resizeToc();
    updateActiveLink();
    window.addEventListener("resize", resizeToc);
    window.addEventListener("scroll", updateActiveLink, { passive: true });
  }

  function createForm(box, payload) {
    var savedPassword = readStoredPassword(payload.id);

    if (savedPassword) {
      box.classList.add("hugo-encrypt-pending");
      box.textContent = "正在解密...";
      decrypt(payload, savedPassword).then(function (html) {
        box.innerHTML = html;
        box.classList.remove("hugo-encrypt-box", "hugo-encrypt-pending");
        box.classList.add("hugo-encrypt-unlocked");
        if (payload.kind === "article") {
          buildArticleToc(box);
        }
      }).catch(function () {
        box.classList.remove("hugo-encrypt-pending");
        renderPasswordForm(box, payload, savedPassword);
      });
      return;
    }

    renderPasswordForm(box, payload, "");
  }

  function renderPasswordForm(box, payload, initialPassword) {
    var form = document.createElement("form");
    form.className = "hugo-encrypt-form";
    form.innerHTML = [
      '<div class="hugo-encrypt-lock" aria-hidden="true">LOCK 🔒</div>',
      '<label class="hugo-encrypt-label" for="' + payload.id + '-password">' + escapeHtml(payload.prompt) + "</label>",
      '<div class="hugo-encrypt-row">',
      '<input id="' + payload.id + '-password" class="hugo-encrypt-input" type="password" autocomplete="current-password">',
      '<button class="hugo-encrypt-button" type="submit">解锁</button>',
      "</div>",
      '<p class="hugo-encrypt-message" role="status" aria-live="polite"></p>'
    ].join("");

    var input = form.querySelector("input");
    var message = form.querySelector(".hugo-encrypt-message");
    input.value = initialPassword || "";

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var password = input.value;
      message.textContent = "正在解密...";

      try {
        var html = await decrypt(payload, password);
        storePassword(payload.id, password);
        box.innerHTML = html;
        box.classList.remove("hugo-encrypt-box");
        box.classList.add("hugo-encrypt-unlocked");
        if (payload.kind === "article") {
          buildArticleToc(box);
        }
      } catch (error) {
        message.textContent = "密码错误或内容已损坏。";
        input.select();
      }
    });

    box.replaceChildren(form);
  }

  function init() {
    if (!window.crypto || !window.crypto.subtle) {
      document.querySelectorAll("[data-hugo-encrypt]").forEach(function (box) {
        box.textContent = "当前浏览器不支持 Web Crypto，无法解密。";
      });
      return;
    }

    document.querySelectorAll("[data-hugo-encrypt]").forEach(function (box) {
      var payload;
      try {
        payload = JSON.parse(box.querySelector("script").textContent);
      } catch (error) {
        box.textContent = "加密数据读取失败。";
        return;
      }
      createForm(box, payload);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
