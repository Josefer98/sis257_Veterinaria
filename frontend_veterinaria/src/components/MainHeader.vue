<template>
  <header>
    <!--? Header Start -->
    <div class="header-area header-transparent">
      <div class="main-header header-sticky">
        <div class="container-fluid">
          <div class="row align-items-center">
            <!-- Logo -->
            <div class="col-xl-2 col-lg-2 col-md-1">
              <div class="logo">
                <a href="index.html"><img src="@/assets/img/logo/logo.png" alt="" /></a>
              </div>
            </div>
            <div class="col-xl-10 col-lg-10 col-md-10">
              <div class="menu-main d-flex align-items-center justify-content-end">
                <!-- Main-menu -->
                <div class="main-menu f-right d-none d-lg-block">
                  <nav>
                    <ul id="navigation">
                      <li class="nav-item">
                        <RouterLink to="/" class="nav-link click-scroll">home</RouterLink>
                      </li>
                      <li class="nav-item">
                        <RouterLink to="/clientes" class="nav-link click-scroll"
                          >Clientes</RouterLink
                        >
                      </li>
                      <li class="nav-item">
                        <RouterLink to="/productos" class="nav-link click-scroll"
                          >Productos</RouterLink
                        >
                      </li>
                      <li class="nav-item">
                        <RouterLink to="/servicios" class="nav-link click-scroll"
                          >Servicios</RouterLink
                        >
                      </li>
                      <li class="nav-item">
                        <RouterLink to="/ventas" class="nav-link click-scroll">Ventas</RouterLink>
                      </li>
                      <li class="nav-item">
                        <RouterLink to="/mascotas" class="nav-link click-scroll">Mascotas</RouterLink>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div class="header-right-btn f-right d-none d-lg-block ml-30">
                  <a href="#" class="header-btn">Usuario</a>
                </div>
              </div>
            </div>
            <!-- Mobile Menu -->
            <div class="col-12">
              <div class="mobile_menu d-block d-lg-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Header End -->
  </header>
</template>
