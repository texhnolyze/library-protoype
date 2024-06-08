<script setup lang="ts">
defineOptions({
  title: "IndexPage",
});

const router = useRouter();
function go(path: string) {
  router.push(path);
}

const menu = [
  {
    title: "Books",
    items: [
      {
        title: "Lend Book",
        path: "/books/lend",
        icon: "i-carbon-catalog-publish",
        classes: "def-btn",
      },
      {
        title: "Add new Book",
        path: "/books/add",
        icon: "i-carbon-add-alt",
        classes: "add-btn",
      },
      {
        title: "Add Book Copy",
        path: "/books/search",
        icon: "i-carbon-add-alt",
        classes: "add-btn",
      },
      {
        title: "Remove Book Copy",
        path: "/books/remove",
        icon: "i-carbon-subtract-alt",
        classes: "remove-btn",
      },
    ],
  },
  {
    title: "Users",
    items: [
      {
        title: "Add User",
        path: "/users/add",
        icon: "i-carbon-add-alt",
        classes: "add-btn",
      },
      {
        title: "Remove User",
        path: "/users/remove",
        icon: "i-carbon-subtract-alt",
        classes: "remove-btn",
      },
    ],
  },
];
</script>

<template>
  <h1 w-full text-4xl>
    <p>
      <i i-carbon-book inline-block align-bottom />
      &nbsp;Library Admin Panel
    </p>
  </h1>

  <div py-4 />

  <div mb-5xl flex-container gap-lg>
    <template v-for="menuItem in menu" :key="menuItem.title">
      <h2 w-full text-left text-2xl>
        {{ menuItem.title }}
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
          {{ subItem.title }}
        </p>
      </button>
    </template>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
