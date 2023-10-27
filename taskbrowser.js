(() => {
    let tasks = [];

    $('#filter_submit').on('click', function(){
        listTasks();
    });

    $('.sortSelect').on('change', function(){
        const v = $(this).val();

        $('.sortSelect').val(0);
        $(this).val(v);
    });

    async function fetchAPIData(){
        const response = await fetch("https://taskman.rs/api/tasks");
        tasks = await response.json();
    
        console.log(tasks);
        listTasks();
    }

    function listTasks(){
        let filteredTasks = tasks.filter(t => {
            if($('#check_tier').is(':checked')){
                if(t.tier_id != parseInt($('#filter_tier').val())) return false;
            }

            if($('#check_title').is(':checked')){
                if(t.title.toLowerCase().indexOf($('#filter_title').val().toLowerCase()) == -1) return false;
            }

            if($('#check_desc').is(':checked')){
                if(t.description.toLowerCase().indexOf($('#filter_desc').val().toLowerCase()) == -1) return false;
            }

            if($('#check_dice').is(':checked')){
                if(t.dice != $('#filter_dice').val()) return false;
            }

            if($('#check_weight').is(':checked')){
                if(t.weight != $('#filter_weight').val()) return false;
            }

            return true;
        }).sort((a,b) => {
            const sTier = $('#sort_tier').val();
            const sTitle = $('#sort_title').val();
            const sDesc = $('#sort_desc').val();
            const sDice = $('#sort_dice').val();
            const sWeight = $('#sort_weight').val();

            if(sTier != 0){
                if(sTier == 1) return a.tier_id - b.tier_id;
                else if(sTier == 2) return b.tier_id - a.tier_id;
            }

            if(sTitle != 0){
                if(sTitle == 1) return a.title.localeCompare(b.title);
                else if(sTitle == 2) return -a.title.localeCompare(b.title);
            }

            if(sDesc != 0){
                if(sDesc == 1) return a.description.localeCompare(b.title);
                else if(sDesc == 2) return -a.description.localeCompare(b.title);
            }

            if(sDice != 0){
                if(sDice == 1){
                    if(a.dice == b.dice){
                        return a.priority - b.priority;
                    }
                    return a.dice - b.dice;
                }
                else if(sDice == 2){
                    if(a.dice == b.dice){
                        return b.priority - a.priority;
                    }
                    return b.dice - a.dice;
                }
            }

            if(sWeight != 0){
                if(sWeight == 1) return a.weight - b.weight;
                else if(sWeight == 2) return b.weight - a.weight;
            }
        });

        $('.taskList').html(
            `<table>
            <tr>
                <th>Hash ID</th>
                <th>Tier</th>
                <th>Title</th>
                <th>Description</th>
                <th>Dice</th>
                <th>Priority</th>
                <th>Weight</th>
            </tr>
            ${
            filteredTasks.map(t => {
                return `<tr>
                    <td>${t.hash_id}</td>
                    <td>${t.tier.slug}</td>
                    <td>${t.title}</td>
                    <td>${t.description}</td>
                    <td>${t.dice}</td>
                    <td>${t.priority || 0}</td>
                    <td>${t.weight}</td>
                <tr>`;
            }).join("")
            }
            </table>
            `
        );
    }

    fetchAPIData();
})();