const { getComputedStyle } = window;

export const vitestSetup = (): void => {
    window.matchMedia =
        window.matchMedia ||
        function () {
            return {
                matches: false,
                addListener: function () {},
                removeListener: function () {}
            };
        };

    window.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    window.getComputedStyle = (elt) => getComputedStyle(elt);
};
