    // Declaración de variables
    const fs = require('fs');
    const mysql = require('mysql2');
    const readline = require('readline');

    // Configuración de la conexión a la base de datos
    const connection = mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '#i6w1Z6M',
      database: 'Formateoventas'
    });

    // Conexión a la base de datos
    connection.connect((err) => {
      if (err) throw err;
      console.log('Conexión exitosa a la base de datos!');
    });

    // Diseño de las tablas
    connection.query(`CREATE TABLE IF NOT EXISTS ventas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      archivo VARCHAR(100) NOT NULL,
      row_type VARCHAR(4) NOT NULL,
      party_code VARCHAR(10),
      version VARCHAR(6),
      sequence INT(7),
      trans VARCHAR(3),
      start_date INT(8),
      end_date INT(8),
      cvs_vendor VARCHAR(10),
      dsd_vendor VARCHAR(10),
      prod_id_qualifier VARCHAR(2),
      prod_code VARCHAR(14),
      po_case_pack INT(4),
      activity_code VARCHAR(2),
      price DECIMAL(12,2),
      cost DECIMAL(12,3),
      storeNumber INT(5),
      quantity VARCHAR(7),
      totalUpcCount VARCHAR(12),
      totalPrice VARCHAR(12),
      lineItemsCount VARCHAR(12),
      totalQuantity VARCHAR(12),
      estado_proceso ENUM('Procesado', 'Fallido')
    )`, (error, results, fields) => {
      if (error) throw error;
      console.log('Tabla "ventas" creada o verificada');
    });

    connection.query(`CREATE TABLE IF NOT EXISTS ejecuciones (
      id INT PRIMARY KEY AUTO_INCREMENT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      estado VARCHAR(20) NOT NULL
    )`, (error, results, fields) => {
      if (error) throw error;
      console.log('Tabla "ejecuciones" creada o verificada');
    });

    // Directorios de archivos
    const directorioNoProcesados = 'Noprocesados';
    const directorioProcesados = 'Procesados';

    // Primero lee archivos no procesados
    fs.readdir(directorioNoProcesados, (error, files) => {
      if (error) throw error;
    //si no hay archivos lanza error
      if (files.length === 0) {
        console.log('No hay archivos para procesar');
        return;
      }

      //Si hay, pues procesa los archivos
      files.forEach((fileName) => {
        const filePath = `${directorioNoProcesados}/${fileName}`;
        const archivo = fileName;

        const readStream = fs.createReadStream(filePath, 'utf-8');
        const rl = readline.createInterface({
          input: readStream,
          crlfDelay: Infinity
        });

        rl.on('line', (line) => {
          if (line.length > 0) {
            try {
              insertarFilaEnVentas(archivo, line, (error) => {
                if (error) {
                  // No se mueve el archivo al directorio de archivos procesados
                  console.error(`Error al insertar fila en ventas del archivo ${archivo}: ${error}`);
                }
              });
            } catch (error) {
              // No se mueve el archivo al directorio de archivos procesados
              console.error(`Error al insertar fila en ventas del archivo ${archivo}: ${error}`);
            }
          }
        });
    rl.on('close', () => {
    // Se mueve el archivo procesado al directorio de procesados
    fs.rename(filePath, `${directorioProcesados}/${fileName}`, (error) => {
    if (error) {
    console.error(`Error al mover el archivo ${fileName} al directorio de archivos procesados: ${error}`);
    return;
    }
    console.log(`Archivo ${fileName} procesado y movido al directorio de archivos procesados`);
    });
    });

    rl.on('error', (error) => {
      // No se mueve el archivo al directorio de archivos procesados
      console.error(`Error al leer el archivo ${fileName}: ${error}`);
    });
    });
    });

    // Función para insertar una fila en la tabla de ventas
    function insertarFilaEnVentas(archivo, fila, callback) {
    const rowType = fila.substr(0, 4).trim();
    const partyCode = fila.substring(4, 13).trim();
    const version = fila.substring(14, 19).trim();
    const sequence = fila.substring(20, 26).trim();

    if (rowType === 'H010') {
    // Fila de tipo header
    const trans = fila.substring(27, 29).trim();
    const startDate = fila.substring(30, 37).trim();
    const endDate = fila.substring(38, 45).trim();
    const cvsVendor = fila.substring(46, 55).trim();
    const dsdVendor = fila.substring(56, 65).trim();

    // Insertar los datos en la tabla 
    connection.query(`INSERT INTO ventas (archivo, row_type, party_code, version, sequence, trans, start_date, end_date, cvs_vendor, dsd_vendor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [archivo, rowType, partyCode, version, sequence, trans, startDate, endDate, cvsVendor, dsdVendor], (error, results, fields) => {
      if (error) throw error;
      console.log('Se insertó una fila en la tabla "ventas"');
    });
    } else if (rowType === 'D010') {
    // Detail d010
    const prodIdQualifier = fila.substring(27, 28).trim();
    const prodCode = parseInt(fila.substring(29, 42));
    const poCasePack = parseInt(fila.substring(43, 46));

    // Insertar los datos en la tabla
    connection.query(`INSERT INTO ventas (archivo, row_type, party_code, version, sequence, prod_id_qualifier, prod_code, po_case_pack) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [archivo, rowType, partyCode, version, sequence, prodIdQualifier, prodCode, poCasePack], (error, results, fields) => {
      if (error) throw error;
      console.log('Se insertó una fila en la tabla "ventas"');
    });
    } else if (rowType === 'D011') {
    // Detail d011
    const activityCode = fila.substring(27, 28).trim();
    const price = parseFloat(fila.substring(29, 40));
    const cost = parseFloat(fila.substring(41, 52));

    // Insertar los datos en la tabla
    connection.query(`INSERT INTO ventas (archivo, row_type, party_code, version, sequence, activity_code, price, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [archivo, rowType, partyCode, version, sequence, activityCode, price, cost], (error, results, fields) => {
    if (error) throw error;
    console.log('Se insertó una fila en la tabla "ventas"');
    });

    } else if (rowType === 'D012') {
    // Detail d012
    //definir variables para loop del detail d012
    //comienza en 12
    const startCharacter = 27;
    //termina en 147
    const endCharacter = 147;
    const step = 12;
    for (let i = startCharacter; i < endCharacter; i += step) {
    const storeNumber = parseInt(fila.substring(i, i + 4));
    const quantity = fila.substring(i + 5, i + 11).trim();

      // Insertar datos
      connection.query(`INSERT INTO ventas (archivo, row_type, party_code, version, sequence, storeNumber, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)`, [archivo, rowType, partyCode, version, sequence, storeNumber, quantity], (error, results, fields) => {
        if (error) throw error;
        console.log('Se insertó una fila en la tabla "ventas"');
      });
    }
    } else if (rowType === 'S010') {
    // fila summary
    const totalUpcCount = fila.substring(27, 38).trim();
    const totalPrice = fila.substring(39, 50).trim();
    const lineItemsCount = fila.substring(51, 62).trim();
    const totalQuantity = fila.substring(63, 74).trim();

    // Insertar los datos 
    connection.query(`INSERT INTO ventas (archivo, row_type, party_code, version, sequence, totalUpcCount, totalPrice, lineItemsCount, totalQuantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [archivo, rowType, partyCode, version, sequence, totalUpcCount, totalPrice, lineItemsCount, totalQuantity], (error, results, fields) => {
      if (error) {
        console.error(`Error al insertar fila en ventas del archivo ${archivo}: ${error}`);
        // Llamamos a la función de devolución de llamada con el error para indicar que la inserción de los datos no fue exitosa
        callback(error);
        return;
      }
      console.log('Se insertó una fila en la tabla "ventas"');
      // Llamamos a la función de devolución de llamada sin pasar ningún error para indicar que la inserción de los datos fue exitosa
      callback(null);
    });
    }

    // Insertar una nueva fila en la tabla de ejecuciones
    connection.query(`INSERT INTO ejecuciones (estado) VALUES ('exitoso')`, (error, results, fields) => {
    if (error) throw error;
    console.log('Se insertó una fila en la tabla "ejecuciones"');
    });

}
// Cerrar la conexión a la base de datos 
process.on('exit', () => {
  connection.end((err) => {
  if (err) throw err;

  console.log('Conexión a la base de datos cerrada');
  });
});