export const card_tpl = `
<div class="cards-content-material" data-uuid="{{uuid}}">
  <p class="images">
      <img class="images-folder" fxtag="imageUrl">
  </p>
  <p class="names">{{name}}</p>
  <div class="tips">
    <!-- <div class="states-files" fxtag="files_states"></div> -->
    <div class="row align-center justify-end">
        <div class="toolicons">
            <i class="vg-icon ic-dots"></i>
            <div class="vg-dropdowns">
                <ul class="vg-dropdowns-content">
                    <li class="vg-dropdowns-li">移动</li> -->
                    <li class="vg-dropdowns-li" fxtag="rename">重命名</li>
                    <li class="vg-dropdowns-li deletetxt" fxtag="delete">删除</li>
                </ul>
            </div>
        </div>
        <div class="vg-avatar-bg avatar-size-24 ml-auto" fxtag="fileTypeUrl" style="background-image: url('{{avatar_url}}');"></div>

    </div>
         
  </div>
</div>

`