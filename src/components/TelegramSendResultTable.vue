<template>
  <q-card id="report-card">
    <q-card-section>
      <q-tabs
      v-model="tab"
      no-caps
      outside-arrows
      mobile-arrows
      class="bg-primary text-white shadow-2"
      >
        <q-tab name="success" label="Успешно отправлено" />
        <q-tab name="errors" label="Не было отправлено" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="success">
          <q-table
            flat bordered
            :rows="response?.correctSendCustomers || []"
            :columns="COLUMNS"
            row-key="id"
          >
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="errors">
          <q-table
            flat bordered
            :rows="response?.errorSendCustomers || []"
            :columns="COLUMNS"
            row-key="id"
          >
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, defineComponent, toRefs, onMounted } from "vue";

const COLUMNS = [
  { name: 'id', label: 'ID', align: 'center', field: 'id', sortable: true },
  { name: 'chatId', align: 'center', label: 'ID чата', field: 'chatId', sortable: true },
  { name: 'firstname', label: 'Имя', field: 'firstname', sortable: true },
  { name: 'lastname', label: 'Фамилия', field: 'lastname', sortable: true  },
  { name: 'username', label: 'Имя пользователя', field: 'username', sortable: true },
  { name: 'createdDate', label: 'Дата запуска бота', field: 'createdDate', sortable: true },
  { name: 'lastEntry', label: 'Дата последней выполненной команды', field: 'lastEntry', sortable: true },
  { name: 'role', label: 'Роль', field: 'role', sortable: true }
]

export default {
  name: "TelegramSendResultTable",
  props: {
    telegramSendResponse: Object
  },
  setup(props) {
    const {telegramSendResponse} = toRefs(props);
    const tab = ref('success');
    onMounted(() => {
      console.log('created component');
    })
    return {
      tab,
      response: ref(telegramSendResponse),
      COLUMNS
    }
  }
};
</script>

<style scoped>
#report-card {
  min-width: 1200px;
}
</style>
