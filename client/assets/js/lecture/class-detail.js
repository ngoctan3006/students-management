const classCode = window.location.search.split('=')[1];
let studentList = [];
let studentPending = [];

const renderStudentList = () => {
  const studentListHtml = studentList.map(
    (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.fullname}</td>
        <td>${item.code}</td>
        <td>${item.midterm ? item.midterm : 'Chưa nhập'}</td>
        <td>${item.final ? item.final : 'Chưa nhập'}</td>
        <td>
          <button class="btn btn-warning" data-toggle="modal" data-target="#editStudentModal"><i
              class="fa fa-fw fa-edit"></i></button>
          <button class="btn btn-danger" onclick="deleteStudent(this)"><i
              class="fa fa-fw fa-trash"></i></button>
        </td>
      </tr>
    `
  );

  $('#student-list-body').html(studentListHtml);
};

const renderPending = () => {
  const pendingHtml = studentPending.map(
    (item) => `
      <tr>
        <td width="10%">${item.code}</td>
        <td width="25%">${item.fullname}</td>
        <td width="10%">
          <button class="btn btn-success"><i class="fa fa-fw fa-check"></i></button>
          <button class="btn btn-danger"><i class="fa fa-fw fa-xmark"></i></button>
        </td>
      </tr>
    `
  );

  $('#pending-body').html(pendingHtml);
};

(async () => {
  try {
    const { data: classInfo } = await API.get(`/class/${classCode}`);
    const { data: studentInClass } = await API.get(`/students/student-list/${classCode}?status=1`);
    const { data: pending } = await API.get(`/students/student-list/${classCode}?status=0`);
    studentList.push(...studentInClass);
    studentPending.push(...pending);

    $('#title').text(`${classInfo.code} - ${classInfo.subjectName.toUpperCase()}`);

    if (studentList.length) {
      $('#no-data').hide();
      $('#student-list').show();
      renderStudentList();
    } else {
      $('#no-data').show();
      $('#student-list').hide();
    }

    if (studentPending.length) {
      $('#no-data-pending').hide();
      $('#pending').show();
      renderPending();
    } else {
      $('#no-data-pending').show();
      $('#pending').hide();
    }
  } catch (error) {
    console.log(error.response.data.message);
  }
})();

const addStudent = async (e) => {
  e.preventDefault();
  try {
    await API.post('class/addStudent', {
      classCode,
      studentCode: $('#student-code').val(),
    });
    alert('Thêm sinh viên thành công');
    renderStudentList();
    $('#addStudentModal').modal('hide');
  } catch (error) {
    alert(error.response.data.message);
  }
};