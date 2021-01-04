describe("Log In", () => {
    it("should see login page", () => {
        cy.visit("/")
            .title()
            .should("eq", "Login | Nuber Eats");
    })

    it("can fill out the form", () => {

        cy.visit('/')
        .findByPlaceholderText(/email/i)
        .type('sdw9090@naver.com')
        .findByPlaceholderText("Password")
        .type('Dptnsla94!')
        .get('.text-lg')
        .should('not.have.class', 'pointer-events-none');

        //Todo (can log in)
    });


    // it("can see email/ password validation error", () => {
    //     cy.visit('/')
    //     .get('[name="email"]')
    //     .type('addfsedd')
    //     .get('.text-red-500')
    //     .should('have.text', 'Please enter a valid email')

    // })
});


