# Documentación del Proceso de Procesamiento de Archivos
Esta documentación proporciona una descripción general del proceso de procesamiento de archivos implementado en el sistema. El código correspondiente se encarga de leer archivos de una carpeta de entrada, extraer datos relevantes de ellos y almacenar esos datos en una base de datos.

# Flujo del Proceso
El proceso de procesamiento de archivos consta de los siguientes pasos:
Configuración de la conexión a la base de datos: Se establece la configuración necesaria para conectarse a una base de datos MySQL local.

> Creación de tablas: Se crean dos tablas en la base de datos: "ventas" y "ejecuciones". Estas tablas se utilizan para almacenar los datos extraídos de los archivos y registrar el estado de ejecución del proceso.

> Lectura de archivos: Se lee el contenido de una carpeta específica que contiene archivos a procesar. Si no hay archivos en la carpeta, se muestra un mensaje indicando que no hay archivos para procesar y se finaliza el proceso.

> Procesamiento de archivos: Para cada archivo encontrado en la carpeta de entrada, se realiza lo siguiente:

- Se abre el archivo y se lee línea por línea.
- Se procesa cada línea, extrayendo los datos relevantes.
- Se insertan los datos extraídos en la tabla "ventas" de la base de datos.
- Si ocurre algún error durante la inserción, se muestra un mensaje de error.
- Si la inserción es exitosa, se muestra un mensaje de éxito y se registra el estado de la fila como "Procesado".
- Movimiento de archivos: Después de procesar un archivo por completo, se mueve de la carpeta de entrada a una carpeta de archivos procesados.

> Registro de ejecuciones: Se registra una nueva fila en la tabla "ejecuciones" para mantener un registro de cada ejecución del proceso. Se almacena la fecha de ejecución y el estado.

> Cierre de la conexión a la base de datos: Al finalizar el proceso, se cierra la conexión a la base de datos.

# Pasos para Ejecutar el Código
Sigue estos pasos para ejecutar el código de procesamiento de archivos:

- Instalación de paquetes de npm: Asegúrate de tener Node.js y npm (Node Package Manager) instalados en tu sistema. Luego, en la terminal, navega hasta el directorio del proyecto y ejecuta el siguiente comando para instalar las dependencias del proyecto:

> npm install

- Configuración de la conexión a la base de datos: En el archivo index.js, asegúrate de configurar correctamente los detalles de conexión a tu base de datos MySQL. Verifica que los valores de host, port, user, password y database coincidan con los de tu entorno.

- Creación de las tablas: El código creará automáticamente las tablas "ventas" y "ejecuciones" en tu base de datos si aún no existen. Si las tablas ya existen, se verificará su estructura.

- Preparación de los directorios: Asegúrate de tener los siguientes directorios creados en la raíz del proyecto:

1.  Noprocesados: Este directorio se utiliza para almacenar los archivos de ventas que aún no han sido procesados.
2.  Procesados: Este directorio se utilizará para mover los archivos procesados.

- Ejecución del código: Una vez que hayas realizado los pasos anteriores, ejecuta el siguiente comando en la terminal para iniciar el proceso de procesamiento de archivos:

>node app.js

El código comenzará a leer los archivos en el directorio Noprocesados, extraerá los datos relevantes y los almacenará en la base de datos. Verás mensajes de registro en la terminal indicando el progreso y el resultado de cada operación.

- Verificación de resultados: Después de ejecutar el código, puedes verificar los resultados en tu base de datos. Comprueba si se han creado las tablas "ventas" y "ejecuciones" y si los datos se han insertado correctamente en la tabla "ventas". Puedes utilizar herramientas como phpMyAdmin o una conexión directa a tu base de datos para realizar esta verificación.

- Cierre del proceso: Una vez que el código haya terminado de procesar los archivos y registrar los datos en la base de datos, puedes detener la ejecución del programa en la terminal presionando Ctrl + C.

# Consideraciones Adicionales
- El sistema se basa en una estructura de archivos específica, donde cada archivo contiene datos relacionados con ventas. El formato de los datos y su procesamiento están adaptados a esa estructura.
- El código utiliza la biblioteca mysql2 para interactuar con la base de datos MySQL.
- Se ha implementado un manejo básico de errores para capturar excepciones durante el proceso de lectura de archivos y la inserción de datos en la base de datos.
- El sistema registra los archivos procesados y su estado en la tabla "ventas" y las ejecuciones en la tabla "ejecuciones" para facilitar el seguimiento y la auditoría del proceso.
- Esta documentación proporciona una descripción general del proceso de procesamiento de archivos implementado. Para obtener más detalles sobre la implementación técnica, se recomienda revisar el código fuente correspondiente.