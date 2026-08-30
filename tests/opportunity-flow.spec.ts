import { test, expect } from "@playwright/test";

test("user can submit an opportunity search", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: [
        'data: {"type":"text-start","id":"test-message"}',
        'data: {"type":"text-delta","id":"test-message","delta":"I found a fully funded technology opportunity for you."}',
        'data: {"type":"text-end","id":"test-message"}',
        "data: [DONE]",
      ].join("\n\n"),
    });
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Opportunity Assistant" })
  ).toBeVisible();

  const input = page.getByRole("textbox", { name: "Message" });

  await expect(input).toBeVisible();

  await input.fill(
    "I'm an undergraduate looking for fully funded technology opportunities."
  );

  await page.getByRole("button", { name: "Send" }).click();

  await expect(
    page.getByText(
      "I'm an undergraduate looking for fully funded technology opportunities."
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      "I found a fully funded technology opportunity for you."
    )
  ).toBeVisible();
});
