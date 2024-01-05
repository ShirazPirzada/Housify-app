import { test, expect } from "@playwright/test";
import path from "path";
const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("tester@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Login Successful!")).toBeVisible();
});

test("Allow user to add apartment", async ({ page }) => {
  await page.goto(`${UI_URL}add-apartment`);
  await page.locator(`[name="name"]`).fill("Test Apartment");
  await page.locator(`[name="city"]`).fill("Test City");
  await page.locator(`[name="country"]`).fill("Test Country");
  await page
    .locator(`[name="description"]`)
    .fill("Description for a test apartment");
  await page.locator(`[name="pricePerMonth"]`).fill("2131");
  await page.selectOption('select[name="Rating"]', "3");
  
  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="tenantCount"]').fill("3");

  await page.setInputFiles('[name="imageFiles"]',[
    path.join(__dirname,"files","Apartment1.jpg"),
    path.join(__dirname,"files","RoomImg1.jpg"),
  ]);

  await page.getByRole("button",{name:"Save"}).click();
  await expect(page.getByText("Apartment Saved!")).toBeVisible();
});
