<html>
  <head></head>
  <body>
    <form>
      <input type='text' name="name" value='myName'>
    </form>
    <p>
      <?php
        $username = $_GET['username'];
        echo $username
      ?>
    </p>
  </body>
</html>
