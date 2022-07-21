let classList = [];

const renderClassList = () => {
  const classListHTML = classList
    .map(
      ({ id, code, room, semester, subjectName }) => `
        <tr>
          <td><a href="class-detail-student.html?code=${code}">${code}</a></td>
          <td>${subjectName}</td>
          <td>${semester}</td>
          <td>${room}</td>
          <td>
              <button class="btn btn-danger"><i class="fa-solid fa-right-from-bracket"></i></button>
          </td>
        </tr>
      `
    )
    .join('');

  $('#class-list-body').html(classListHTML);
};

const fetchClass = async () => {
  try {
    const { data } = await API.get('/class/student');
    classList = data ? data : [];
    if (classList.length) {
      $('#no-data').hide();
      $('#class-list').show();
      renderClassList();
    } else {
      $('#no-data').show();
      $('#class-list').hide();
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};

fetchClass();

const joinClass = async (e) => {
  e.preventDefault();
  const classCode = $('#class-code').val();
  try {
    await API.post('class/request-join-class', { classCode });
    alert('Đã gửi yêu cầu tham gia lớp thành công, hãy đợi giáo viên chấp nhận bạn vào lớp!');
    $('#registerModal').modal('hide');
  } catch (error) {
    alert(error.response.data.message);
  }
};