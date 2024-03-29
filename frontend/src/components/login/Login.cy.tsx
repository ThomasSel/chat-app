import Login from "./Login";

const navigate = () => {};

describe("Login", () => {
  it("has visible email and password fields, and a submit button", () => {
    cy.mount(<Login navigate={navigate} />);

    cy.get('[data-cy="login-email"]').should("be.visible");
    cy.get('[data-cy="login-password"]').should("be.visible");
    cy.get('[data-cy="login-submit"]').should("be.visible");
  });

  it("sends a validly formatted request when submitting the form", () => {
    cy.intercept("post", "/api/login", {
      statusCode: 200,
      body: { message: "success", token: "fakeToken" },
    }).as("loginRequest");

    cy.mount(<Login navigate={navigate} />);

    cy.get('[data-cy="login-email"]').type("test@test.com");
    cy.get('[data-cy="login-password"]').type("1234Password1234");
    cy.get('[data-cy="login-submit"]').click();

    cy.wait("@loginRequest").then((interception) => {
      expect(interception.request.body.email).to.equal("test@test.com");
      expect(interception.request.body.password).to.equal("1234Password1234");
    });
  });

  it("redirects to /chats after a valid request/response", () => {
    cy.intercept("post", "/api/login", {
      statusCode: 200,
      body: { message: "success", token: "fakeToken" },
    }).as("loginRequest");

    const navigateStub = cy.stub().as("navigateStub");

    cy.mount(<Login navigate={navigateStub} />);

    cy.get('[data-cy="login-email"]').type("test@test.com");
    cy.get('[data-cy="login-password"]').type("1234Password1234");
    cy.get('[data-cy="login-submit"]').click();

    cy.wait("@loginRequest").then((interception) => {
      cy.get("@navigateStub").should("be.calledOnceWith", "/chats");
    });
  });

  it("doesn't redirect if the response isn't valid", () => {
    cy.intercept("post", "/api/login", {
      statusCode: 401,
      body: { message: "Invalid details" },
    }).as("loginRequest");

    const navigateStub = cy.stub().as("navigateStub");

    cy.mount(<Login navigate={navigateStub} />);

    cy.get('[data-cy="login-email"]').type("test@test.com");
    cy.get('[data-cy="login-password"]').type("wrongPassword");
    cy.get('[data-cy="login-submit"]').click();

    cy.wait("@loginRequest").then((interception) => {
      cy.get("@navigateStub").should("not.be.called");
    });
  });

  describe("form validation", () => {
    describe("email", () => {
      it("fails if empty", () => {
        cy.mount(<Login navigate={navigate} />);

        cy.get('[data-cy="login-password"]').type("1234Password1234");

        cy.get<HTMLInputElement>('[data-cy="login-email"]')
          .then(($el) => $el[0].checkValidity())
          .should("be.false");
      });
    });

    describe("password", () => {
      it("fails if empty", () => {
        cy.mount(<Login navigate={navigate} />);

        cy.get('[data-cy="login-email"]').type("test@test.com");

        cy.get<HTMLInputElement>('[data-cy="login-password"]')
          .then(($el) => $el[0].checkValidity())
          .should("be.false");
      });
    });
  });
});
