let Agent = function(name, ip, port){
    var self = this;

    self.Name = ko.observable(name);
    self.Ip = ip;
    self.Port = port;

    self.Status = ko.observable("green");

    self.Command = "";
    self.CommandResult = "";
    self.CommandRunTimestamp = "N/A"

    self.CanContact = function(){
        
        mainViewModel.ShouldShowAddAgentError(false);
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                mainViewModel.Agents.push(self);
                mainViewModel.ShowAddAgentDialog(false);
                mainViewModel.ShouldShowAddAgentError(false);
            }else if(this.readyState == 4){
                mainViewModel.ShouldShowAddAgentError(true);
            }
        };

        try{
            let url = "http://"+self.Ip+":"+self.Port+"/api/health";
            console.log(url);
            xhttp.open("GET", url, true);
            xhttp.send();
        }catch(e){
            mainViewModel.ShouldShowAddAgentError(true);
        }

        return true;
    };
};

function AppViewModel(){
    var self = this;
    self.Agents = ko.observableArray([new Agent("T-rav","127.0.0.1",1234)]);
    
    self.ShouldShowAgents = ko.observable(true);
    self.ShouldShowAddAgent = ko.observable(false);
    
    self.ShouldShowAddAgentError = ko.observable(false);

    self.ShowAddAgentDialog = function(shouldShow){
        self.ShouldShowAddAgentError(false);
        self.ShouldShowAddAgent(shouldShow);
        self.ShouldShowAgents(!shouldShow);
    }

    self.AddAgent = function(formElement){
        var agent = new Agent(formElement.name.value, formElement.ip.value, formElement.port.value);
        agent.CanContact();
    }
}
