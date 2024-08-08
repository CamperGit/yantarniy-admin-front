<template>
  <q-page class="flex flex-center">
    <q-card id="send-card">
      <q-card-section class="text-center text-bold text-h6">
        Создание рассылки
      </q-card-section>
      <q-card-section>
        <q-input v-model="description" label="Текст рассылки" type="textarea"></q-input>
      </q-card-section>
      <q-card-section>
        <q-file
          v-model="image"
          outlined
          append
          label="Изображение"
          accept=".jpg, image/*"
          :filter="checkFileFilters"
          @rejected="onRejected"
          @update:model-value="onImageAdd"
        >
        </q-file>
      </q-card-section>
      <q-card-section v-if="imageUrlPreview">
        <div class="dialog-title">Превью загруженного изображения</div>
        <q-img :src="imageUrlPreview"></q-img>
      </q-card-section>
      <q-card-section class="row q-mx-sm q-pb-md justify-between">
        <q-checkbox class="col-6" v-model="testTelegramSending" label="Протестировать?"/>
        <q-btn v-if="testTelegramSending"
               class="filter-button"
               :disable="!isValidItem(description, image)"
               @click="sendTelegramMessageWithNotify(image, description, null, true)"
               color="primary" no-caps label="Протестировать"/>
      </q-card-section>
      <q-card-actions class="q-mx-md q-pb-md row">
        <q-btn size="md" class="filter-button" no-caps
               color="primary" label="Создать"
               :disable="!isValidItem(description, image)"
               @click="sendTelegramMessageWithNotify(image, description, null, false)" v-close-popup/>
        <q-space/>
        <q-btn size="md" class="filter-button" color="red-5" no-caps label="Отмена" v-close-popup/>
      </q-card-actions>
    </q-card>
    <q-dialog v-model="openTelegramSendResultDialog">
      <telegram-send-result-table :telegram-send-response="telegramSendResponse"></telegram-send-result-table>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import TelegramSendService from "src/services/telegram/telegramSendService";
import TelegramSendResultTable from "components/TelegramSendResultTable.vue";
export default {
  name: "SendingPage",
  components: { TelegramSendResultTable },
  setup() {
    const $q = useQuasar();
    const description = ref(null);
    const image = ref(null);
    const imageUrlPreview = ref(null);
    const testTelegramSending = ref(false);
    const openTelegramSendResultDialog = ref(false);
    const telegramSendResponse = ref(null);
    const sendTelegramMessage = async (file, description, fileModel, onlyAdmins) => {
      telegramSendResponse.value = await TelegramSendService.sendMessage(file, description, fileModel, onlyAdmins);
      openTelegramSendResultDialog.value = true;
    }
    const checkFileFilters = (files) => {
      return files.filter(file => file.size < 10480) &&
        files.filter(file => file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg');
    }

    const onRejected = (rejectedEntries) => {
      $q.notify({
        type: 'negative',
        message: `Убедитесь, что файл(ы) имеет формат jpg, jpeg, png и их размер не превышает 10 МБайт`
      })
    }

    const onImageAdd = (file) => {
      imageUrlPreview.value = URL.createObjectURL(file);
    }

    const isValidItem = (description, image) => {
      return description || image;
    }

    const sendTelegramMessageWithNotify = async (image, description, fileModel, onlyAdmins) => {
      try {
        await sendTelegramMessage(image, description, fileModel, onlyAdmins)
        $q.notify({
          type: 'positive',
          message: `Рассылка была успешно закончена`
        })
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: `Ошибка при создании рассылки`
        })
        throw e;
      }
    }

    return {
      description,
      image,
      imageUrlPreview,
      testTelegramSending,
      openTelegramSendResultDialog,
      telegramSendResponse,
      onRejected,
      checkFileFilters,
      onImageAdd,
      sendTelegramMessageWithNotify,
      isValidItem
    }
  }
};
</script>

<style scoped>
#send-card {
  width: 600px;
}

.filter-button {
  width: 130px;
}
</style>
