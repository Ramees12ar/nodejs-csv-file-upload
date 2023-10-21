import { agent } from "supertest";
import chai from "chai"
import fs from "fs"

const TEST_BASE_URL = "http://localhost:3005/api/";

const { expect } = chai;
let request;
before(async () => {
    request = agent(TEST_BASE_URL);
})

describe("CSV file uploader test cases", () => {
    /**
     *  login API testing
     */
    describe("Login API", () => {
        it("post username and password", async () => {
            const payload = {
                username: "admin",
                password: "admin@123"
            }
            const res = await request.post("/login").send(payload)
            expect(res.status).to.equal(200)
            expect(res.body).to.be.an("object")
            expect(res.body.accessToken).to.be.an("string")
        });
    });
    /**
     * csv file upload
     */
    describe('File Upload API', () => {
        const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ3OWM0OWEwMzI0NmViNmFmNjY5Iiwic3VwZXJBZG1pbiI6dHJ1ZSwiaWF0IjoxNjk3ODcxMDY0LCJleHAiOjE2OTg0NzU4NjR9.cJWSEeSiNEAGXIn7vXVCcyzvY3XXJxqUTCVd4dLex9U"
        it('should upload a file', async () => {
            const res = await request.post("/upload").attach('file', fs.readFileSync('./survey-2021.csv'), 'survey-2021.csv')
                .set("accessToken", accessToken)
            expect(res.status).to.equal(200)
            expect(res.body.status).to.equal(200)
        });
    });
})