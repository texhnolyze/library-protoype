<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import type { Book } from "../../types";

defineOptions({
  name: "AddBookPage",
});
const { t } = useI18n();
const router = useRouter();
const route = useRoute("/books/add");

const canvasId = ref("qr-code-canvas");
const formId = ref("add-book-form");
const formData = ref({
  title: "",
  authors: "",
  isbn: "",
  coverUrl: "",
  number: 1,
  publishedAt: "",
});

const isUpdateProcess = ref(false);
const formChecked = ref(false);
const isTitleValid = computed(() => formData.value.title.length > 0);
const isPublishedAtValid = computed(
  () => formData.value.publishedAt.length > 0,
);
const areAuthorsValid = computed(() => formData.value.authors.length > 3);
const isIsbnValid = computed(
  () => formData.value.isbn.length >= 13 && formData.value.isbn.length <= 14,
);
const isNumberValid = computed(() => formData.value.number > 0);
const isCoverUrlValid = computed(
  () => !formData.value.coverUrl || URL.canParse(formData.value.coverUrl),
);

const isFormValid = computed(
  () =>
    isTitleValid.value &&
    areAuthorsValid.value &&
    isIsbnValid.value &&
    isNumberValid.value &&
    isCoverUrlValid.value,
);

const errors = ref<object>({});
const success = ref(false);

function checkForm() {
  errors.value = {};
  formChecked.value = true;

  if (!isTitleValid.value) errors.value.title = t("add.errors.title");

  if (!areAuthorsValid.value) errors.value.authors = t("add.errors.authors");

  if (!isIsbnValid.value) errors.value.isbn = t("add.errors.isbn");

  if (!isPublishedAtValid.value)
    errors.value.publishedAt = t("add.errors.publishedAt");

  if (!isNumberValid.value) errors.value.number = t("add.errors.number");

  if (!isCoverUrlValid.value) errors.value.coverUrl = t("add.errors.coverUrl");
}

const books = useBooksStore();
const book = ref<Book>({
  id: { uuid: "" },
  title: "",
  authors: [],
  isbn: "",
  number: 0,
  coverUrl: null,
  publishedAt: null,
});

function bookToFormData() {
  formData.value = {
    title: book.value.title,
    authors: book.value.authors.map((author) => author.name).join(", "),
    isbn: book.value.isbn,
    coverUrl: book.value.coverUrl.toString(),
    publishedAt: book.value.publishedAt?.toISOString().split("T")[0],
    number: book.value.number,
  };
}

function formDataToBook() {
  book.value = {
    id: { uuid: uuidv4() },
    title: formData.value.title,
    authors: formData.value.authors
      .split(",")
      .map((name) => ({ name: name.trim() })),
    isbn: formData.value.isbn,
    publishedAt: new Date(formData.value.publishedAt),
    number: formData.value.number,
  };
  console.log(formData.value.publishedAt);

  if (formData.value.coverUrl)
    book.value.coverUrl = new URL(formData.value.coverUrl);
}

function addBookToLibrary() {
  checkForm();
  if (!isFormValid.value) return;

  formDataToBook();
  QRCode.toCanvas(
    document.getElementById(canvasId.value),
    book.value.id.uuid,
    { width: 300 },
    (err: Error) => {
      if (err) console.error(err);
      success.value = true;
    },
  );

  if (isUpdateProcess.value) books.update(book.value);
  else books.add(book.value);
}

watchEffect(() => {
  if (route.query?.uuid) {
    const foundBook = books.get(route.query.uuid);
    if (foundBook) {
      book.value = foundBook;
      bookToFormData();
      isUpdateProcess.value = true;
    }
  }
});
</script>

<template>
  <div flex-container gap-lg>
    <form v-show="!success" :id="formId" w-full flex flex-wrap>
      <div form-row>
        <label input-label class="basis-[calc(33.3%-1.125rem)]" for="title">{{
          t("add.labels.title")
        }}</label>
        <input
          id="title"
          v-model="formData.title"
          class="basis-[calc(66.6%-1.125rem)]"
          type="text"
          minlength="1"
          maxlength="100"
          required
          input-field
          :class="{ 'border-red-300': formChecked && !isTitleValid }"
        />
      </div>
      <div form-row>
        <label input-label class="basis-[calc(33.3%-1.125rem)]" for="authors">{{
          t("add.labels.authors")
        }}</label>
        <input
          id="authors"
          v-model="formData.authors"
          class="basis-[calc(66.6%-1.125rem)]"
          type="text"
          minlength="3"
          required
          input-field
          :class="{ 'border-red-300': formChecked && !areAuthorsValid }"
        />
      </div>
      <div form-row>
        <label input-label class="basis-[calc(33.3%-1.125rem)]" for="isbn">{{
          t("add.labels.isbn")
        }}</label>
        <input
          id="isbn"
          v-model="formData.isbn"
          class="basis-[calc(66.6%-1.125rem)]"
          type="text"
          minlength="13"
          maxlength="14"
          required
          input-field
          :class="{ 'border-red-300': formChecked && !isIsbnValid }"
        />
      </div>
      <div form-row>
        <label
          input-label
          class="basis-[calc(33.3%-1.125rem)]"
          for="publishedAt"
          >{{ t("add.labels.publishedAt") }}</label
        >
        <input
          id="publishedAt"
          v-model="formData.publishedAt"
          class="basis-[calc(66.6%-1.125rem)]"
          type="date"
          required
          input-field
          :class="{ 'border-red-300': formChecked && !isPublishedAtValid }"
        />
      </div>
      <div form-row>
        <label input-label class="basis-[calc(33.3%-1.125rem)]" for="number">{{
          t("add.labels.number")
        }}</label>
        <input
          id="number"
          v-model="formData.number"
          class="basis-[calc(66.6%-1.125rem)]"
          type="number"
          min="1"
          max="10"
          required
          input-field
          :class="{ 'border-red-300': formChecked && !isNumberValid }"
        />
      </div>
      <div form-row>
        <label
          input-label
          class="basis-[calc(33.3%-1.125rem)]"
          for="coverUrl"
          >{{ t("add.labels.coverUrl") }}</label
        >
        <input
          id="coverUrl"
          v-model="formData.coverUrl"
          input-field
          class="basis-[calc(66.6%-1.125rem)]"
          type="url"
          :class="{ 'border-red-300': formChecked && !isCoverUrlValid }"
        />
      </div>
      <div v-show="formData.coverUrl.length" form-row>
        <div
          input-label
          class="basis-[calc(33.3%-1.125rem)]"
          for="coverPreview"
        >
          {{ t("add.labels.preview") }}
        </div>
        <img
          w-1
          class="basis-[calc(33.3%-1.125rem)]"
          :src="formData.coverUrl"
        />
      </div>

      <div form-row>
        <div class="basis-[calc(33.3%-1.125rem)]" />
        <div class="basis-[calc(66.6%-1.125rem)]">
          <p
            v-for="(error, key) of errors"
            :key="key"
            text-left
            text-red-500
            font-bold
          >
            {{ error }}
          </p>
        </div>
      </div>

      <div form-row>
        <button
          btn
          remove-btn
          class="basis-[calc(33.3%-1.125rem)]"
          @click="router.push('/')"
        >
          {{ t("add.buttons.cancel") }}
        </button>

        <button
          btn
          add-btn
          type="button"
          class="basis-[calc(66.6%-1.125rem)]"
          :disabled="formChecked && !isFormValid"
          @click="addBookToLibrary"
        >
          {{ isUpdateProcess ? t("add.buttons.update") : t("add.buttons.add") }}
        </button>
      </div>
    </form>

    <div v-show="success" w-full flex flex-wrap justify-center>
      <div w-full text-center text-xl font-bold>
        <p>
          {{
            isUpdateProcess
              ? t("add.messages.updated")
              : t("add.messages.added")
          }}
        </p>
        <p>{{ t("add.messages.print") }}</p>
      </div>
      <div w-full py-4 />
      <canvas :id="canvasId" />
      <div w-full py-4 />
      <button btn add-btn @click="router.push('/')">
        {{ t("add.buttons.back") }}
      </button>
      <div w-full py-4 />
    </div>
  </div>
</template>
