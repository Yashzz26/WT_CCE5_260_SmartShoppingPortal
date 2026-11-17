(function () {
  const readLocation = () => {
    const raw = window.location.hash.slice(1) || "/";
    const [path, search = ""] = raw.split("?");
    return {
      path: path.replace(/\/+$/, "") || "/",
      query: new URLSearchParams(search),
    };
  };

  const navigate = (url, replace = false) => {
    const value = url.startsWith("#") ? url : `#${url}`;
    if (value === window.location.hash) return;
    window.history[replace ? "replaceState" : "pushState"]({}, "", value);
    window.dispatchEvent(new CustomEvent("kickora:navigate"));
  };

  const start = (render) => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("[data-link]");
      if (!link || link.target === "_blank" || event.metaKey || event.ctrlKey) return;
      event.preventDefault();
      navigate(link.getAttribute("href") || "#/");
    });
    window.addEventListener("hashchange", () => window.dispatchEvent(new CustomEvent("kickora:navigate")));
    window.addEventListener("popstate", () => window.dispatchEvent(new CustomEvent("kickora:navigate")));
    window.addEventListener("kickora:navigate", () => render(readLocation()));
    render(readLocation());
  };

  window.KickoraRouter = { navigate, start, readLocation };
})();
