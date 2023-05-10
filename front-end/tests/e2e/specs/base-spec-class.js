module.exports = class Page {
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  enterPage(pageName) {
    cy.visit(`/${pageName.toLowerCase()}`);
  }

  getElementByIdName(elementName, inputName) {
    const inputId = inputName.toLowerCase().replace(/ /g, "-");
    return cy.get(elementName + "#" + inputId);
  }

  getInputByName(inputName) {
    return this.getElementByIdName("input", inputName);
  }

  typeInputById(fieldName, value) {
    if (value) {
      const input = this.getInputByName(fieldName);
      input.type(value);
    }
  }

  shouldSeeHeading(heading) {
    this.getElementByIdName("span", "heading").invoke("text").should((text) => {
      expect(text).to.eq(heading);
    });
  }

  getButton(buttonId) {
    return cy.get("button#" + buttonId);
  }

  clickButton(btnName) {
    // maybe span with class v-btn__content
    const buttonId = btnName.toLowerCase().replace(/ /g, "-");
    const button = this.getButton(buttonId);

    button.click();
  }

  checkAlertContent(content) {
    cy.get("text#alert-content")
      .invoke("text")
      .should((text) => {
        expect(text).to.eq(content);
      });
  }

  checkAlertType(type) {
    cy.get(`div#${type}-alert`).should("be.visible");
  }

  checkPageUrl(pageName) {
    const url = this.baseUrl + "/" + pageName.toLowerCase().replace(/ /g, "-");
    cy.url().should("be.equal", url);
  }

  checkBtnLinksExists(linkName) {
    const buttonId = linkName.toLowerCase().replace(/ /g, "-") + "-link";
    const button = this.getButton(buttonId);

    button.should("be.visible");
  }

  checkErrorForInput(fieldName, errorContent) {
    const inputDetails = this.getElementByIdName(
      "div",
      fieldName + "-messages"
    );

    inputDetails.invoke("text").should((text) => {
      expect(text).to.eq(errorContent);
    });
  }

  checkBtnDisabled(btnName) {
    const buttonId = btnName.toLowerCase().replace(" ", "-");
    const button = this.getButton(buttonId);

    button.should("be.disabled");
  }
};
