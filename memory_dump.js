// memory dump using node.js

var fs=require("fs");

function print_memory_of_pid(pid, only_writable=true)
{
    console.log(pid);
    /*
    Run as root, take an integer PID and return the contents of memory to STDOUT
    */
    var memory_permissions;
    if(only_writable==true)
    {
        memory_permissions="rw";
    }
    else
    {
        memory_permissions="r-";
    }
    var maps_file=fs.openSync("/proc/"+pid+"/maps", "r");
    var mem_file=fs.openSync("/proc/"+pid+"/mem", "r", 0);

    var buf=Buffer.alloc(10000+1);
    var actual_size=fs.readSync(maps_file, buf, 0, 10000, 0);
    var lines=buf.toString();
    var lines_array=lines.split("\n");

    

    for (line of lines_array)
    {
        if(line.includes("rw-p"))
        {
            var address_start=parseInt("0x"+line.split(" ")[0].split("-")[0]);
            var address_end=parseInt("0x"+line.split(" ")[0].split("-")[1]);
            var buffer_size=address_end-address_start;
            
            var buf=Buffer.alloc(buffer_size+1);
            
            fs.readSync(mem_file, buf, 0, buffer_size, address_start);

            process.stdout.write(buf.toString());
        }
    }
}

print_memory_of_pid("self");
