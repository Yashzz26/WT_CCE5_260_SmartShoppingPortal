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
    const renderCurrent = () => {
      const location = readLocation();
      const title = location.path === "/" ? "KICKORA | Step Up Your Style" : `${location.path.slice(1).replaceAll("-", " ")} | KICKORA`;
      document.title = title.replace(/\b\w/g, (letter) => letter.toUpperCase());
      render(location);
    };
    window.addEventListener("kickora:navigate", renderCurrent);
    renderCurrent();
  };

  window.KickoraRouter = { navigate, start, readLocation };
})();
