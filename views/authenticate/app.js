function App(args) {
	this.token = function(args) {
		localStorage.access_token = args[2];
		localStorage.loggedIn = true;	
		self.location = "#!/";
	};
}