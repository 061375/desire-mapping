$(document).ready(function(){
    $("div").click(function() {
        var rightArrowParents = [];
        $(this).parents().addBack().not('html').each(function() {
          var entry = this.tagName.toLowerCase();
          if (this.className) {
            entry += "." + this.className.replace(/ /g, '.');
          }
          rightArrowParents.push(entry);
        });
        console.log (rightArrowParents.join(" "));
        return false;
    });
});