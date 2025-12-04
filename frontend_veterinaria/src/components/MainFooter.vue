<template>
  <footer>
    <!-- Footer Start-->
    <div class="footer-area">
      <div class="container">
        <div class="row justify-content-between">
          <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div class="single-footer-caption mb-50">
              <div class="footer-logo mb-25">
                <a href="/" class="logo-text">
                  <i class="pi pi-heart-fill"></i> PetCare
                </a>
              </div>
              <div class="footer-tittle">
                <div class="footer-pera">
                  <p>
                    Dedicados al cuidado y bienestar de tus mascotas. 
                    Ofrecemos servicios veterinarios de alta calidad con un equipo 
                    profesional y apasionado por los animales.
                  </p>
                </div>
              </div>
              <!-- social -->
              <div class="footer-social">
                <a href="#"><i class="pi pi-facebook"></i></a>
                <a href="#"><i class="pi pi-twitter"></i></a>
                <a href="#"><i class="pi pi-instagram"></i></a>
                <a href="#"><i class="pi pi-youtube"></i></a>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6">
            <div class="single-footer-caption mb-50">
              <div class="footer-tittle">
                <h4>Enlaces Rápidos</h4>
                <ul>
                  <li><a href="/"><i class="pi pi-angle-right"></i> Inicio</a></li>
                  <li><a href="/about"><i class="pi pi-angle-right"></i> Sobre Nosotros</a></li>
                  <li><a href="/services"><i class="pi pi-angle-right"></i> Servicios</a></li>
                  <li><a href="/contact"><i class="pi pi-angle-right"></i> Contacto</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">
            <div class="single-footer-caption mb-50">
              <div class="footer-tittle">
                <h4>Nuestros Servicios</h4>
                <ul>
                  <li><a href="#"><i class="pi pi-angle-right"></i> Consulta General</a></li>
                  <li><a href="#"><i class="pi pi-angle-right"></i> Vacunación</a></li>
                  <li><a href="#"><i class="pi pi-angle-right"></i> Cirugía</a></li>
                  <li><a href="#"><i class="pi pi-angle-right"></i> Peluquería Canina</a></li>
                  <li><a href="#"><i class="pi pi-angle-right"></i> Emergencias 24/7</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">
            <div class="single-footer-caption mb-50">
              <div class="footer-tittle">
                <h4>Contáctanos</h4>
                <ul class="contact-info">
                  <li>
                    <i class="pi pi-phone"></i>
                    <a href="tel:+59173473424">+591 73473424</a>
                  </li>
                  <li>
                    <i class="pi pi-envelope"></i>
                    <a href="mailto:info@petcare.bo">info@petcare.bo</a>
                  </li>
                  <li>
                    <i class="pi pi-map-marker"></i>
                    <span>Av. Las Américas #123<br>Sucre - Bolivia</span>
                  </li>
                  <li>
                    <i class="pi pi-clock"></i>
                    <span>Lun - Sab: 8:00 - 20:00<br>Dom: Emergencias</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- footer-bottom area -->
    <div class="footer-bottom-area">
      <div class="container">
        <div class="footer-border">
          <div class="row d-flex align-items-center">
            <div class="col-xl-12">
              <div class="footer-copy-right text-center">
                <p>
                  Copyright &copy; {{ new Date().getFullYear() }} 
                  Todos los derechos reservados | Hecho con <i class="pi pi-heart-fill" style="color: #ff6f61;"></i> por 
                  <a href="#" target="_blank">PetCare Team</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer End-->
  </footer>
</template>

<style scoped>
.footer-area {
  background: #ffffff;
  padding-top: 80px;
  padding-bottom: 40px;
  color: #555555;
  border-top: 1px solid #f0f0f0;
}

.footer-logo {
  margin-bottom: 30px;
}

.logo-text {
  font-size: 32px;
  font-weight: 800;
  color: #333333;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text i {
  color: #ff6f61;
  font-size: 32px;
}

.footer-tittle h4 {
  color: #333333;
  font-size: 20px;
  margin-bottom: 30px;
  font-weight: 700;
  position: relative;
  padding-bottom: 15px;
  letter-spacing: 0.5px;
}

.footer-tittle h4::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  background: #ff6f61;
}

.footer-tittle ul li {
  margin-bottom: 15px;
  list-style: none;
}

.footer-tittle ul li a {
  color: #666666;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.footer-tittle ul li a:hover {
  color: #ff6f61;
  padding-left: 5px;
}

.footer-tittle ul li a i {
  font-size: 12px;
  color: #ff6f61;
}

.contact-info li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.contact-info li i {
  color: #ff6f61;
  font-size: 20px;
  margin-top: 3px;
}

.contact-info li span {
  line-height: 1.6;
}

.footer-social {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.footer-social a {
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #555555;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-social a:hover {
  background: #ff6f61;
  color: white;
  transform: translateY(-3px);
}

.footer-bottom-area {
  background: #f8f9fa;
  padding: 25px 0;
  border-top: 1px solid #eeeeee;
}

.footer-copy-right p {
  color: #666666;
  margin: 0;
  font-size: 14px;
}

.footer-copy-right a {
  color: #ff6f61;
  text-decoration: none;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-area {
    padding-top: 60px;
  }
  
  .single-footer-caption {
    margin-bottom: 40px;
  }
}
</style>