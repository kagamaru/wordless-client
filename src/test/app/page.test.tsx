import { test } from "vitest";
import { render } from "@testing-library/react";
import Home from "@/app/page";

test("Page", () => {
    render(<Home />);
});
