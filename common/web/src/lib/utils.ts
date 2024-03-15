export const scrollToElementById = (id: string) => {
  const headerHeight = 80;
  const element = document.getElementById(id);
  if (element)
    window.scrollTo({
      top: element.offsetTop - headerHeight + 10,
      behavior: "smooth",
    });
};
