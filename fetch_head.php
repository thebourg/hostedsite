<!DOCTYPE html>
<html>

<body>

	<div>
	<h1>
		<?php
		if (isset($_GET['username'])) {
		 echo $_GET['username'];
		} else {
		// Fallback behaviour goes here
		}
		?> </h1>
<a href="https://ipsoft-amelia-demodeveu-v3.ipsoft.com/Amelia/ui/TheBankExperience/chat?embed=iframe&domainCode=sweden&processName=CreditCardProcessing&username=<?php
if (isset($_GET['username'])) {
 echo $_GET['username'];
} else {
// Fallback behaviour goes here
}
?>">test </a>
	</div>
	<div id="search">
	  <form id="try" method="get" target="receiver" action="<?php
if (isset($_GET['username'])) {
    echo $_GET['username'];
} else {
    // Fallback behaviour goes here
}?>">
	     Username: <input id="username_form" name="username_form" type="text"/>
	     Dept: <input id="dept" name="dept" type="text" />
	     <input type="submit"/>
	  </form>
	  </div>
	  <iframe name="receiver" id="receiver" width="400" height="500"></iframe>
	</div>

<script>
	var username_form = document.getElementById("username_form").value;
	var price2 = 'Peter';
	var url = https://ipsoft-amelia-demodeveu-v3.ipsoft.com/Amelia/ui/TheBankExperience/chat?embed=iframe&domainCode=sweden&processName=CreditCardProcessing&username=Peter;
	document.getElementById("demo").innerHTML = url;

</script>

</body>

</html>
