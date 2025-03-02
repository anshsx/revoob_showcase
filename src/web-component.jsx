import React from "react";
import ReactDOM from "react-dom/client";
import { Widget } from "./components/Widget";

export const normalizeAttribute = (attribute) =>
  attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

class WidgetWebComponent extends HTMLElement {
  constructor() {
    super();
    this.root = null;
  }

  connectedCallback() {
    this.renderReactComponent();
  }

  attributeChangedCallback() {
    this.renderReactComponent();
  }

  static get observedAttributes() {
    return ["project-id", "popover-theme", "button-theme"];
  }

  getPropsFromAttributes() {
    const props = {};
    for (const { name, value } of this.attributes) {
      props[normalizeAttribute(name)] = value;
    }
    return props;
  }

  renderReactComponent() {
    const props = this.getPropsFromAttributes();

    if (!this.root) {
      this.attachShadow({ mode: "open" });
      this.root = ReactDOM.createRoot(this.shadowRoot);
    }

    this.root.render(<Widget {...props} />);
  }
}

export default WidgetWebComponent;
