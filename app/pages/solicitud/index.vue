<template>
  <div class="font-semibold text-xl text-stone-700 pt-8 px-10">Administración de solicitudes</div>

  <div class="bg-white rounded-lg shadow-2xl m-4 md:m-8 p-8 border">
    <SolicitudTable :register="true" />
  </div>
</template>
