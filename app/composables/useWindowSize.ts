export default function (size: number) {
  const match = ref(true)

  function updateMatch() {
    match.value = window.matchMedia(`(min-width: ${size}px)`).matches
  }

  onMounted(() => window.addEventListener('resize', updateMatch))
  onUnmounted(() => window.removeEventListener('resize', updateMatch))

  return { match }
}
