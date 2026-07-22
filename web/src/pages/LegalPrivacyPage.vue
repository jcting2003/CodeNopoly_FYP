<template>
  <div class="min-h-screen bg-background text-on-background">
    <NavBar />

    <main class="pt-24 pb-16 overflow-hidden">
      <section class="relative px-6 md:px-12 lg:px-24 pt-14 pb-10">
        <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_28%)]" />

        <div class="max-w-5xl mx-auto">
          <div class="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-xs font-black uppercase tracking-[3px] text-on-secondary-container">
            <span class="material-symbols-outlined text-sm">shield</span>
            Project Notice
          </div>

          <h1 class="mt-5 text-5xl md:text-7xl font-black tracking-tighter leading-none">
            Privacy Policy
            <br />
            <span class="text-primary">& Legal Information</span>
          </h1>

          <p class="mt-6 max-w-3xl text-lg leading-8 text-on-surface-variant">
            This page explains how this undergraduate final year project handles user information
            and sets expectations for educational use. This project was created by
            <span class="font-black text-on-surface"> Chok Wan Ting </span>
            at
            <span class="font-black text-on-surface"> Asia Pacific University </span>.
          </p>
        </div>
      </section>

      <section class="px-6 md:px-12 lg:px-24 py-6">
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          <article class="rounded-[2rem] bg-surface-container-low p-6">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
              <span class="material-symbols-outlined">school</span>
            </div>
            <h2 class="mt-4 text-2xl font-black">Academic Purpose</h2>
            <p class="mt-3 text-sm leading-7 text-on-surface-variant">
              This application is an academic final year project and is intended primarily for
              coursework, demonstration, and evaluation.
            </p>
          </article>

          <article class="rounded-[2rem] bg-surface-container-low p-6">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary-container text-on-tertiary-container">
              <span class="material-symbols-outlined">lock</span>
            </div>
            <h2 class="mt-4 text-2xl font-black">Basic Data Use</h2>
            <p class="mt-3 text-sm leading-7 text-on-surface-variant">
              User account information, gameplay activity, and profile data are used only to run
              the application features and support the project experience.
            </p>
          </article>

          <article class="rounded-[2rem] bg-surface-container-low p-6">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
              <span class="material-symbols-outlined">gavel</span>
            </div>
            <h2 class="mt-4 text-2xl font-black">Good-Faith Notice</h2>
            <p class="mt-3 text-sm leading-7 text-on-surface-variant">
              The project is provided in good faith for academic use and may still contain
              experimental features, incomplete flows, or prototype limitations.
            </p>
          </article>
        </div>
      </section>

      <section class="px-6 md:px-12 lg:px-24 py-12">
        <div class="max-w-5xl mx-auto space-y-6">
          <article id="privacy" class="rounded-[2rem] bg-surface-container-lowest p-6 md:p-8 shadow-[0_14px_45px_rgba(15,23,42,0.06)]">
            <p class="text-xs font-black uppercase tracking-[3px] text-primary">Privacy Policy</p>
            <h2 class="mt-3 text-3xl md:text-4xl font-black tracking-tight">How information is used</h2>

            <div class="mt-6 space-y-5 text-sm leading-8 text-on-surface-variant">
              <p>
                This project may collect basic information such as name, email, profile photo,
                authentication details, gameplay progress, leaderboard data, and in-game activity
                needed to support account access and game participation.
              </p>
              <p>
                Information is used only for the normal operation of the project, such as login,
                joining games, tracking turns, displaying rankings, and supporting the mobile or
                web gameplay experience.
              </p>
              <p>
                As an undergraduate academic project, this application is not presented as an
                enterprise-grade commercial platform. Reasonable care may be taken in development,
                but no guarantee is made that the system offers production-level privacy,
                compliance, or long-term retention controls.
              </p>
              <p>
                If this project is demonstrated to lecturers, evaluators, or test participants,
                the data shown is intended only for project presentation, feature validation, and
                coursework review.
              </p>
            </div>
          </article>

          <article id="legal" class="rounded-[2rem] bg-surface-container-lowest p-6 md:p-8 shadow-[0_14px_45px_rgba(15,23,42,0.06)]">
            <p class="text-xs font-black uppercase tracking-[3px] text-tertiary">Legal Notice</p>
            <h2 class="mt-3 text-3xl md:text-4xl font-black tracking-tight">Project scope and limitations</h2>

            <div class="mt-6 space-y-5 text-sm leading-8 text-on-surface-variant">
              <p>
                CodeNopoly is an undergraduate final year project by
                <span class="font-black text-on-surface"> Chok Wan Ting </span>
                at
                <span class="font-black text-on-surface"> Asia Pacific University </span>.
                It is provided for academic, educational, and demonstration purposes.
              </p>
              <p>
                The software, content, and interactions in this project are supplied on a
                best-effort basis. Features may change during development, and some systems may
                behave like prototypes rather than finished commercial software.
              </p>
              <p>
                Users should not treat this project as a banking, legal, healthcare, or
                safety-critical platform. It should also not be relied on as a certified production
                environment or as a substitute for professional legal or technical guarantees.
              </p>
              <p>
                By using the project, participants acknowledge that the system is part of an
                academic submission and that reasonable educational testing, review, and evaluation
                may occur within the context of the university project.
              </p>
            </div>
          </article>

          <article class="rounded-[2rem] bg-slate-950 px-6 py-6 md:px-8 text-white">
            <p class="text-xs font-black uppercase tracking-[3px] text-white/60">Contact Context</p>
            <p class="mt-3 text-sm leading-7 text-white/80">
              If you need to clarify how this project is being used, the appropriate context is as
              an Asia Pacific University final year project submission and demonstration system.
            </p>
          </article>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/AppFooter.vue'
</script>
