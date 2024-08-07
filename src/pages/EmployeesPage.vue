<template>
  <q-page padding>
    <q-card flat square class="row q-pr-none" style="height: 100%">
      <q-card flat square class="col-12 q-py-md q-pl-md q-pr-none" style="height: 100%">
        <q-card-section class="col-12">
          <q-table
            flat bordered
            ref="tableRef"
            :rows="rows || []"
            :columns="COLUMNS"
            row-key="id"
            v-model:pagination="pagination"
            :loading="loading"
            no-data-label="Не удалось найти данные"
            @request="onRequestTableData"
          >
<!--            <template v-slot:body-cell-delete="props">-->
<!--              <q-td :props="props" class="q-pa-none q-ma-none">-->
<!--                <div class="q-pa-none q-ma-none">-->
<!--                  <q-btn flat color="red-5" icon="delete" class="expense-table-buttons q-pa-none q-ma-none"-->
<!--                         @click="deleteExpense(props.row)"></q-btn>-->
<!--                </div>-->
<!--              </q-td>-->
<!--            </template>-->
<!--            <template v-slot:body-cell-edit="props">-->
<!--              <q-td :props="props" class="q-pa-none q-ma-none">-->
<!--                <div class="q-pa-none q-ma-none">-->
<!--                  <q-btn flat color="grey" icon="edit" class="expense-table-buttons q-pa-none q-ma-none"-->
<!--                         @click="openEditDialog(props.row)"></q-btn>-->
<!--                </div>-->
<!--              </q-td>-->
<!--            </template>-->
<!--            <template v-slot:body-cell-image="props">-->
<!--              <q-td :props="props" class="q-pa-none q-ma-none">-->
<!--                <div class="q-pa-none q-ma-none">-->
<!--                  {{ props.row }}-->
<!--                  <q-img :src="props.row.storageUrl"></q-img>-->
<!--                </div>-->
<!--              </q-td>-->
<!--            </template>-->
<!--            <template v-slot:header="props">-->
<!--              <q-tr :props="props">-->
<!--                <q-th-->
<!--                  v-for="col in props.cols"-->
<!--                  :key="col.name"-->
<!--                  :props="props"-->
<!--                  style="color: #A53AB5FF; font-size: 15px; font-weight: 600"-->
<!--                >-->
<!--                  {{ col.label }}-->
<!--                </q-th>-->
<!--              </q-tr>-->
<!--            </template>-->
            <template v-slot:top>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-card>
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
    label: "Идентификатор",
    field: "id",
    align: "center",
    style: "max-width: 20px;",
    sortable: true
  },
  {
    name: "description",
    label: "Описание",
    field: "description",
    align: "center",
    style: "max-width: 200px",
    sortable: true
  },
  {
    name: "type",
    label: "Тип сотрудника",
    field: (row) => row.type.title,
    align: "center",
    style: "max-width: 180px;",
    headerStyle: "max-width: 180px;",
    sortable: true
  },
  {
    name: "location",
    label: "Локация",
    field: (row) => row.location.title,
    align: "center",
    style: "max-width: 200px;",
    sortable: true
  },
  {
    name: "image",
    label: "Изображение",
    field: (row) => row.file,
    align: "center",
    style: "max-width: 170px;"
  },
  {
    name: "delete",
    align: "center",
    style: "width: 32px;max-width: 64px; padding: 7px 4px 7px 16px;",
    headerStyle: "width: 32px;width: 64px; padding: 7px 4px 7px 16px;"

  },
  {
    name: "edit",
    align: "center",
    style: "width: 32px;max-width: 64px; padding: 7px 16px 7px 4px;",
    headerStyle: "width: 32px;max-width: 64px; padding: 7px 16px 7px 4px;"

  }
];

export default defineComponent({
  name: "EmployeesPage",
  setup() {
    const tableRef = ref();
    const loading = ref(false);
    const rows = ref([]);
    const pagination = ref({
      sortBy: "id",
      descending: true,
      page: 0,
      rowsPerPage: 5,
      rowsNumber: 0
    });
    const employeeTypes = ref([]);
    const locations = ref([]);

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

    const updatePaginationByPage = (page) => {
      pagination.value.page = page.pageNumber + 1;
      pagination.value.rowsPerPage = page.pageSize;
      pagination.value.sortBy = page.sortProperty;
      pagination.value.descending = page.sortDirection === "DESC";
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
      updatePaginationByPage(data);
    };

    const onRequestTableData = async (props) => {
      console.log(props);
      console.log("start interaction");
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      // const filter = props.filter

      loading.value = true;

      const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
      await search(page, fetchCount, sortBy, descending);

      loading.value = false;
    };

    onMounted(async () => {
      employeeTypes.value = await EmployeeTypeService.getAll();
      locations.value = await LocationService.getAll();
      tableRef.value.requestServerInteraction();
    });

    return {
      rows,
      employeeTypes,
      locations,
      COLUMNS,
      pagination,
      loading,
      tableRef,
      onRequestTableData
    };
  }
});
</script>
