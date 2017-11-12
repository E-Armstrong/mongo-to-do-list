var mainVm = new Vue({
    el: '#app',
    data: {
        list: [],
        newItem: [],
        message: "New Task"
    },
    methods: {
        newToDo: function(event){
            event.preventDefault();
            console.log("Vue newToDo triggered")
            console.log(this.newItem.name)
            $.post('/newtodo', {newList: this.newItem.name}, function(data){
                mainVm.list.push(data)
                // console.log("$.post(data):", data)
                mainVm.newItem = []
                mainVm.getFreshData()
            })
        },
        getFreshData: function(event){
            $.post("/currenttodos", function(data) {
                console.log("the getFreshData data: ", data)
                mainVm.list = data
            })
        },
        deleteToDo: function(toDo, index, event) {
            var id = mainVm.list[index]._id
            console.log("ID String from main.js:", mainVm.list[index]._id)
            $.post("/deletetodo", {id: id}, function(err, dataFromServer){
                if (err) {console.log(err)}
                mainVm.getFreshData()
            })
        },
        markAsChecked: function(toDo, index, event){
            var id = mainVm.list[index]._id
            var isCheckedComplete = mainVm.list[index].isCheckedComplete
            $.post("/markaschecked", 
            {id: id, isCheckedComplete: isCheckedComplete}, 
            function(err, dataFromServer, data){
                if (err) {console.log(err)}
                mainVm.getFreshData()
            })
        },
    },
    created(){
        this.getFreshData()
     },
})