const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('✅ API đang hoạt động!');
});

app.get('/sessions', async (req, res) => {
  try {
    const url = 'https://sicbo6886-default-rtdb.firebaseio.com/taixiu_sessions.json';
    const { data } = await axios.get(url);

    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ error: 'Không có dữ liệu' });
    }

    // Chuyển object thành mảng
    const sessionsArray = Object.values(data);

    // Tìm session mới nhất theo Phien lớn nhất
    const latest = sessionsArray.reduce((max, curr) =>
      curr.Phien > max.Phien ? curr : max
    );

    // Trả về đúng format
    const result = {
      Phien: latest.Phien,
      Xuc_xac_1: latest.xuc_xac_1,
      Xuc_xac_2: latest.xuc_xac_2,
      Xuc_xac_3: latest.xuc_xac_3,
      Tong: latest.tong,
      Ket_qua: latest.ket_qua
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại cổng ${PORT}`));
