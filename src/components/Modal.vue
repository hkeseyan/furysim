<template>
  <div class="modal" :class="{ 'active': active }">
    <div class="background" @click="hide()"></div>
    <section class="content">
      <slot/>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false
    }
  },
  methods: {
    show() {
      this.active = true
    },
    hide() {
      this.active = false
    }
  }
}
</script>

<style>
  .modal {
    display: none;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    z-index: 40;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .modal.active {
    display: flex;
  }
  .modal .background {
    position: absolute;
    background: #000;
    opacity: 0.85;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .modal .content {
    margin: 0 auto;
    max-height: calc(100vh - 40px);
    width: 480px;
    overflow: auto;
    position: relative;
    padding: 3rem;
    background: var(--background-color);
    border-radius: 5px;
  }
  @media (max-width: 768px) {
    .modal .content {
      width: calc(100vw - 40px);
      padding: 1.5rem;
    }
  }
</style>
