export const scrollToElementById = (id: string) => {
  const headerHeight = 80;
  const element = document.getElementById(id);
  if (element)
    window.scrollTo({
      top: element.offsetTop - headerHeight + 10,
      behavior: "smooth",
    });
};

export const getSecret = () => {
  console.log("secret", process.env.SECRET);
  return process.env.SECRET || "";
};
