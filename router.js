const appDiv = document.getElementById("app");

const home = () => {
  const content = `
    <h1>Home</h1>
    <div>
        <a href="#/about">About</a>
        <a href="#/coco">Corentin</a>
    </div>
    `;
  const section = document.createElement("section");
  section.innerHTML = content;
  appDiv.appendChild(section);
};

const about = () => {
  const content = `
    <h1>About</h1>
    <div>
        <a href="#/">Home</a>
    </div>
    `;
  const section = document.createElement("section");
  section.innerHTML = content;
  appDiv.appendChild(section);
};

const redirectFactory = (url) => {
  return () => {
    const waitingTime = 5;
    const meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "refresh");
    meta.setAttribute("content", `${waitingTime};URL=${url}`);

    const head = document.querySelector("head");

    const content = `
      <h1>Redirection</h1>
      <p>Redirecting to ${url} in ${waitingTime} s.</p>
      `;
    const section = document.createElement("section");
    section.innerHTML = content;
    appDiv.appendChild(section);

    head.appendChild(meta);
  };
};

/* ******************************* */
/*          FRAMEWORK              */
/* ******************************* */

const routes = {};
const templates = {};

const route = (path, template) => {
  if (typeof template === "function") {
    routes[path] = template;
    return routes[path];
  } else if (typeof template === "string") {
    routes[path] = templates[template];
    return routes[path];
  }
};

const template = (name, templateFunction) => {
  templates[name] = templateFunction;
  return templates[name];
};

// registering routes
template("home", home);
template("about", about);

// defining route to the templates
route("/", "home");
route("/about", "about");

function resolveRoute(route) {
  const found = routes[route];

  if (!found) {
    throw new Error(`Route ${route} not found`);
  }

  return found;
}

function cleanRender() {
  const sections = appDiv.querySelectorAll("section");
  sections.forEach((element) => {
    appDiv.removeChild(element);
  });

  const redirects = document.querySelectorAll("meta[http-equiv]");
  const head = document.querySelector("head");
  if (redirects) {
    redirects.forEach((meta) => {
      head.removeChild(meta);
    });
  }
}

function router(event) {
  const url = window.location.hash.slice(1) || "/";
  const route = resolveRoute(url);

  cleanRender();

  route();
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
