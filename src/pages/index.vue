<script setup lang="ts">
defineOptions({
  title: 'IndexPage',
})

const { t } = useI18n()

const router = useRouter()
function go(path: string) {
  router.push(path)
}

const menu = [
  {
    titleKey: 'index.books.title',
    items: [
      {
        titleKey: 'index.books.lend',
        path: '/books/lend',
        icon: 'i-carbon-catalog-publish',
        classes: 'def-btn',
      },
      {
        titleKey: 'index.books.add',
        path: '/books/add',
        icon: 'i-carbon-add-alt',
        classes: 'add-btn',
      },
      {
        titleKey: 'index.books.copy',
        path: '/books/search',
        icon: 'i-carbon-add-alt',
        classes: 'add-btn',
      },
      {
        titleKey: 'index.books.remove',
        path: '/books/remove',
        icon: 'i-carbon-subtract-alt',
        classes: 'remove-btn',
      },
    ],
  },
  {
    titleKey: 'index.users.title',
    items: [
      {
        titleKey: 'index.users.add',
        path: '/users/add',
        icon: 'i-carbon-add-alt',
        classes: 'add-btn',
      },
      {
        titleKey: 'index.users.remove',
        path: '/users/remove',
        icon: 'i-carbon-subtract-alt',
        classes: 'remove-btn',
      },
    ],
  },
]
</script>

<template>
  <h1 w-full text-4xl>
    <p>
      <i i-carbon-book inline-block align-bottom />
      &nbsp;{{ t("index.title") }}
    </p>
  </h1>

  <div py-4 />

  <div mb-5xl flex-container gap-lg>
    <template v-for="menuItem in menu" :key="menuItem.title">
      <h2 w-full text-left text-2xl>
        {{ t(menuItem.titleKey) }}
      </h2>

      <button
        v-for="subItem in menuItem.items"
        :key="subItem.title"
        :class="subItem.classes"
        class="basis-[calc(50%-1.125rem)]"
        space-between
        align-center
        flex
        flex-row
        justify-center
        p-8
        text-xl
        btn
        @click="go(subItem.path)"
      >
        <i :class="subItem.icon" class="basis-[10%]" />
        <p class="basis-[90%]">
          {{ t(subItem.titleKey) }}
        </p>
      </button>
    </template>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
