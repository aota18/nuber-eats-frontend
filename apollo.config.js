module.exports = {
    client: {
        tagName: 'gql',
        includes: ["./src/**/*.tsx"],
        service: {
            name: "number-eats-backend",
            url: "http://localhost:4000/graphql"
        }

    }
}