import React from "react";
import ReactDOM from "react-dom/client";
import Widget from "@/src/components/widget";

class WidgetWebComponent extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const mountPoint = document.createElement("div");
    shadowRoot.appendChild(mountPoint);

    const projectId = this.getAttribute("project-id"); // Get Project ID from attribute

    const root = ReactDOM.createRoot(mountPoint);
    root.render(<Widget projectId={projectId} />);
  }
}

customElements.define("feedback-widget", WidgetWebComponent);
