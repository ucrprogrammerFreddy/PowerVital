export function FooterCliente() {
  return `
  <footer class="pie">
    <img src="../../Complementos/img/facebook.png" alt="Imagen del footer" class="footer-logo" />
    <img src="../../Complementos/img/instagram.png" alt="Imagen del footer" class="footer-logo" />
  </footer>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("mainWrapper");
  wrapper.insertAdjacentHTML("beforeend", FooterCliente());
});
