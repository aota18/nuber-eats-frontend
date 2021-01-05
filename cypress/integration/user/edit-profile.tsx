describe("Edit Profile", () => {
    const user = cy;

    it("can go to /edit-profile using the header", () => {

        // @ts-ignore
        user.login("sdw9090@naver.com", "Dptnsla94!");

        user.get('a[href="/edit-profile"]').click();
    })
})