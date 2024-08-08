<template>
  <q-page padding>
    <q-card flat square class="row q-pr-none" style="height: 100%">
      <q-card flat square class="col-12 q-py-md q-pl-md q-pr-none" style="height: 100%">
        <q-card-section class="col-12">
          <q-table
            bordered grid
            ref="tableRef"
            :rows="rows || []"
            :columns="COLUMNS"
            row-key="id"
            v-model:pagination="pagination"
            :loading="loading"
            no-data-label="Не удалось найти данные"
            @request="onRequestTableData"
          >
            <template v-slot:item="props">
              <div
                class="q-pa-md col-xs-8 col-sm-6 col-md-6 col-lg-4 grid-style-transition"
              >
                <q-card bordered flat class="custom-card row">
                  <q-card-section class="col-3">
                    <q-card flat>
                      <q-card-section>
                        <div class="card-title">ID</div>
                        <div class="card-content">{{props.row.id}}</div>
                      </q-card-section>
                      <q-card-section>
                        <div class="card-title">Описание</div>
                        <div class="card-content">{{props.row.description}}</div>
                      </q-card-section>
                      <q-card-section>
                        <div class="card-title">Тип сотрудника</div>
                        <div class="card-content">{{props.row.type.title}}</div>
                      </q-card-section>
                      <q-card-section>
                        <div class="card-title">Локация</div>
                        <div class="card-content">{{props.row.location.title}}</div>
                      </q-card-section>
                    </q-card>
                  </q-card-section>
                  <q-card-section class="col-9">
                    <q-card flat>
                      <q-card-section>
                        <div class="row">
                          <div class="card-title">Изображение</div>
                          <q-space></q-space>
                          <div>
                            <q-btn flat color="grey" icon="edit" class="action-buttons"
                                   @click="openEditDialog(props.row)"></q-btn>
                          </div>
                          <div>
                            <q-btn flat color="red-5" icon="delete" class="action-buttons"
                                   @click="openDeleteDialog(props.row)"></q-btn>
                          </div>
                        </div>
                        <div class="card-content">
                          <q-img :src="props.row.file.storageUrl" class="card-image"></q-img>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-card-section>
                </q-card>
              </div>
            </template>
            <template v-slot:top>
              <q-card class="filters-container q-pt-none full-width">
                <q-card-section class="row q-pt-none justify-evenly q-col-gutter-x-xl q-col-gutter-y-md">
                  <div class="col-6 col-md-3 q-mt-sm">
                    <q-select bg-color="#ffa221" v-model="pagination.sortBy" @update:model-value="updateTable" label-color="white" color="#ffa221" class="text-input" options-dense :options="SORT_PROPERTIES"
                              map-options emit-value dense label="Сортировать по"/>
                  </div>
                  <div class="col-6 col-md-3 q-mt-sm">
                    <q-select v-model="pagination.descending" @update:model-value="updateTable" label-color="white" color="#ffa221" options-dense :options="SORT_DIRECTIONS"
                              map-options emit-value dense label="В порядке"/>
                  </div>
                  <div class="col-6 col-md-3 q-mt-sm">
                    <q-btn round color="primary" glossy icon="filter_alt" @click="filtersDialog = true"/>
                  </div>
                  <div class="col-6 col-md-3 row q-mt-sm">
                    <q-space/>
                    <q-btn label="Добавить" no-caps color="primary" @click="openCreateDialog"></q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-card>
    <q-dialog v-model="filtersDialog">
      <q-card class="dialog-width-default q-pa-sm">
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none items-center">
          <q-input class="q-ma-none" dense filled v-model="filters.descriptionLike" label="Фильтрация по описанию"></q-input>
        </q-card-section>
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none">
          <q-select v-model="filters.locationId" options-dense :options="locations" dense
                    map-options emit-value option-label="title" option-value="id"
                    label="Фильтрация по локациям"/>
        </q-card-section>
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none">
          <q-select v-model="filters.typeId" options-dense :options="employeeTypes" dense
                    map-options emit-value option-label="title" option-value="id"
                    label="Фильтрация по типу"/>
        </q-card-section>
        <q-card-actions class="q-mx-md q-pb-md row">
          <q-btn size="md" class="filter-button" no-caps
                 color="primary" label="Поиск"
                 @click="updateTable" v-close-popup/>
          <q-btn size="md" class="filter-button clear-filter-button" no-caps
                 label="Сбросить"
                 @click = "cleanFilters"
                 v-close-popup/>
          <q-space/>
          <q-btn size="md" class="filter-button" color="red-5" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createDialog">
      <q-card class="dialog-width-default q-pa-sm">
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none items-center">
          <q-input class="q-ma-none" dense filled v-model="item.description" label="Описание"></q-input>
        </q-card-section>
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none">
          <q-select v-model="item.location.id" options-dense :options="locations" dense
                    map-options emit-value option-label="title" option-value="id"
                    label="Локация"/>
        </q-card-section>
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none">
          <q-select v-model="item.type.id" options-dense :options="employeeTypes" dense
                    map-options emit-value option-label="title" option-value="id"
                    label="Тип"/>
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
        <q-card-actions class="q-mx-md q-pb-md row">
          <q-btn size="md" class="filter-button" no-caps
                 color="primary" label="Создать"
                 @click="createItem(item, image)" v-close-popup/>
          <q-space/>
          <q-btn size="md" class="filter-button" color="red-5" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editDialog">
      <q-card class="dialog-width-default q-pa-sm">
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none items-center">
          <q-input class="q-ma-none" dense filled v-model="item.description" label="Описание"></q-input>
        </q-card-section>
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none">
          <q-select v-model="item.location.id" options-dense :options="locations" dense
                    map-options emit-value option-label="title" option-value="id"
                    label="Локация"/>
        </q-card-section>
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none">
          <q-select v-model="item.type.id" options-dense :options="employeeTypes" dense
                    map-options emit-value option-label="title" option-value="id"
                    label="Тип"/>
        </q-card-section>
        <q-card-section v-if="item.file">
          <div class="dialog-title">Превью существующего изображения</div>
          <q-img :src="item.file.storageUrl"></q-img>
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
        <q-card-actions class="q-mx-md q-pb-md row">
          <q-btn size="md" class="filter-button" no-caps
                 color="primary" label="Изменить"
                 @click="editItem(item, image)" v-close-popup/>
          <q-space/>
          <q-btn size="md" class="filter-button" color="red-5" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteDialog">
      <q-card class="dialog-width-default q-pa-sm">
        <q-card-section class="items-center dialog-title text-center">
          <div>Вы уверены, что хотите удалить выбранную запись?</div>
        </q-card-section>
        <q-card-actions class="q-mx-md q-pb-md row">
          <q-btn size="md" class="filter-button" no-caps
                 color="primary" label="Да"
                 @click="deleteItem(item)" v-close-popup/>
          <q-space/>
          <q-btn size="md" class="filter-button" color="red-5" no-caps label="Нет" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted, watch, defineComponent } from "vue";
import { useQuasar } from "quasar";
import EmployeeService from "src/services/employee/employeeService";
import EmployeeTypeService from "src/services/employee/employeeTypeService";
import LocationService from "src/services/location/locationService";

const COLUMNS = [
  {
    name: "id",
  },
  {
    name: "description",
  },
  {
    name: "type",
  },
  {
    name: "location",
  },
  {
    name: "image",
  },
  {
    name: "edit",

  },
  {
    name: "delete",
  }
];

const SORT_PROPERTIES = [
  {
    label: 'Идентификатору',
    value: 'id'
  },
  {
    label: 'Описанию',
    value: 'description'
  },
  {
    label: 'Типу',
    value: 'type'
  },
  {
    label: 'Локации',
    value: 'location'
  },
]
const SORT_DIRECTIONS = [
  {
    label: 'Возрастания',
    value: false
  },
  {
    label: 'Убывания',
    value: true
  },
]

export default defineComponent({
  name: "EmployeesPage",
  setup() {
    const $q = useQuasar();
    const tableRef = ref();
    const loading = ref(false);
    const rows = ref([]);
    const pagination = ref({
      sortBy: "id",
      descending: false,
      page: 0,
      rowsPerPage: 5,
      rowsNumber: 0
    });
    const employeeTypes = ref([]);
    const locations = ref([]);
    const item = ref({
      location: {
        id: null
      },
      type: {
        id: null
      }
    });
    const image = ref(null);
    const imageUrlPreview = ref(null);

    const filters = ref({
      typeId: null,
      locationId: null,
      descriptionLike: null
    });

    const filtersDialog = ref(false);
    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const createDialog = ref(false);

    const getPageFilterOrNull = (filters, filter) => {
      if (!filters) {
        return null;
      }
      const filterValue = filters[filter];
      if (filterValue) {
        return filterValue;
      } else {
        return null;
      }
    };

    const cleanFilters = () => {
      filters.value = {
        typeId: null,
        locationId: null,
        descriptionLike: null
      };
      updateTable();
    }

    const updatePaginationByPage = (page, sortBy, descending) => {
      pagination.value.page = page.pageNumber + 1;
      pagination.value.rowsPerPage = page.pageSize;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
      pagination.value.rowsNumber = page.totalElements;
      rows.value = page.content;
    };

    const search = async (pageNumber, rowsPerPage, sortBy, descending, filters) => {
      const data = await EmployeeService.getPage({
        typeId: getPageFilterOrNull(filters, "typeId"),
        locationId: getPageFilterOrNull(filters, "locationId"),
        descriptionLike: getPageFilterOrNull(filters, "descriptionLike"),
        pageNumber: (pageNumber - 1),
        pageSize: rowsPerPage,
        sortDirection: descending ? "DESC" : "ASC",
        sortProperty: sortBy
      });
      updatePaginationByPage(data, sortBy, descending);
    };

    const onRequestTableData = async (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;

      loading.value = true;

      const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
      await search(page, fetchCount, sortBy, descending, filters.value);

      loading.value = false;
    };

    const openCreateDialog = async () => {
      item.value = {
        location: {
          id: null,
        },
        type: {
          id: null
        }
      };
      image.value = null
      imageUrlPreview.value = null;
      createDialog.value = true;
    }

    const openDeleteDialog = async (data) => {
      item.value = data;
      image.value = null
      imageUrlPreview.value = null;
      deleteDialog.value = true;
    }

    const openEditDialog = async (data) => {
      item.value = data;
      image.value = null
      imageUrlPreview.value = null;
      editDialog.value = true;
    }

    const deleteItem = async (item) => {
      try {
        await EmployeeService.deleteById(item.id);
        updateTable();
        $q.notify({
          type: 'positive',
          message: `Элемент был успешно удален`
        })
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: `Ошибка при удалении элемента, попробуйте снова и если ошибка повторится, обратитесь к администратору`
        })
        throw e;
      }
    }

    const editItem = async (data, image) => {
      try {
        await EmployeeService.update(data, image);
        updateTable();
        $q.notify({
          type: 'positive',
          message: `Элемент был успешно обновлен`
        })
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: `Ошибка при обновлении элемента, попробуйте снова и если ошибка повторится, обратитесь к администратору`
        })
        throw e;
      }
    }

    const createItem = async (data, image) => {
      try {
        await EmployeeService.create(data, image);
        updateTable();
        $q.notify({
          type: 'positive',
          message: `Элемент был успешно добавлен`
        })
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: `Ошибка при создании элемента, попробуйте снова и если ошибка повторится, обратитесь к администратору`
        })
        throw e;
      }
    }

    const updateTable = () => {
      tableRef.value.requestServerInteraction();
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

    const employeeLocations = ['GYM', 'GROUP_ACTIVITY', 'POOL', 'NAILS', 'COSMETOLOGY', 'STYLISTS', 'MASSAGE'];

    onMounted(async () => {
      employeeTypes.value = await EmployeeTypeService.getAll();
      const locationsBeforeFiltering = await LocationService.getAll();
      locations.value = locationsBeforeFiltering.filter(location => employeeLocations.includes(location.type))
      tableRef.value.requestServerInteraction();
    });

    return {
      rows,
      employeeTypes,
      locations,
      pagination,
      loading,
      tableRef,
      createDialog,
      editDialog,
      deleteDialog,
      filtersDialog,
      item,
      filters,
      image,
      imageUrlPreview,
      COLUMNS,
      SORT_PROPERTIES,
      SORT_DIRECTIONS,
      checkFileFilters,
      onRejected,
      onRequestTableData,
      createItem,
      editItem,
      deleteItem,
      openCreateDialog,
      openEditDialog,
      openDeleteDialog,
      updateTable,
      cleanFilters,
      onImageAdd
    };
  }
});
</script>

<style>

.dialog-width-default {
  width: 600px;
}

.filters-container {
  height: 60px;
}

.action-buttons {
  margin: 0 -13px 0 12px;
  padding: 0 8px;
}

.custom-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.custom-card:hover {
  transform: scale(1.05);
}

.card-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 5px;
}
.card-content {
  font-size: 1.3em;
  color: #555;
  margin-bottom: 10px;
}

.card-image {
  width: 100%;
  height: 550px;
  display: block;
  object-fit: scale-down;
}

.filter-button {
  width: 110px;
}

.clear-filter-button {
  background-color: #2c2c2c;
  color: white
}

.dialog-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
