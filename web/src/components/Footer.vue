<template>
  <footer
    class="px-6 md:px-12 lg:px-24 py-12 bg-surface-container-lowest flex flex-col md:flex-row justify-between items-start gap-8"
  >
    <div class="space-y-4">
      <span class="text-xl font-bold tracking-tighter text-blue-700">Pythonopoly</span>
      <p class="text-xs text-on-surface-variant max-w-xs font-body">
        A production by APU student. All code execution is final. No refunds on
        corrupted dependencies.
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-12">
      <div class="flex flex-col gap-3">
        <span class="text-[10px] uppercase font-label tracking-widest font-bold">
          Documentation
        </span>
        <a class="text-sm hover:text-primary" href="#">NFC Setup</a>
        <a class="text-sm hover:text-primary" href="#">Rulebook</a>
      </div>

      <div class="flex flex-col gap-3">
        <span class="text-[10px] uppercase font-label tracking-widest font-bold">Community</span>
        <a class="text-sm hover:text-primary" href="#">GitHub Repo</a>
      </div>

      <div class="flex flex-col gap-3">
        <span class="text-[10px] uppercase font-label tracking-widest font-bold">Legal</span>
        <a class="text-sm hover:text-primary" href="#">Privacy Policy</a>
        <a class="text-sm hover:text-primary" href="#">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>