(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.youtube_optimized = {
    attach: function (context, settings) {
      const replaceYouTube = function ($element, settings) {
        const baseUrl = `//www.youtube.com/embed/${settings.videoId}`;
        const query = buildUrl(settings);
        const videoUrl = baseUrl + query;
        const iframe = `<iframe width="${settings.width}" height="${settings.height}" src="${videoUrl}" frameborder="0" allowfullscreen=""></iframe>`;
        $element.html(iframe);
      };

      const replace = function (element, settings) {
        const $element = $(element);
        settings.videoId ? replaceYouTube($element, settings) : false;
        $element.addClass('replaced')
      };

      const setPreviewYouTube = function ($element, data) {
        const previewUrls = {
          0: `//img.youtube.com/vi/${data.videoId}/default.jpg`,
          320: `//img.youtube.com/vi/${data.videoId}/mqdefault.jpg`,
          480: `//img.youtube.com/vi/${data.videoId}/hqdefault.jpg`,
          640: `//img.youtube.com/vi/${data.videoId}/sddefault.jpg`,
          1280: `//img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`,
        };
        const elementWidth = $element.innerWidth();
        let thumbnailUrl = previewUrls[0];

        // Detect which preview is better to load, for reducing extra image size
        // loading.
        $.each(previewUrls, function (width, preview) {
          if (elementWidth > width) {
            thumbnailUrl = preview;
          }
        });

        const iconUrl = drupalSettings.path.baseUrl + drupalSettings.youtube_optimized.modulePath + "/images/youtube-icon-dark.svg";
        const html = '<div class="preview" style="background-image: url(' + thumbnailUrl + ')"><img src="' + iconUrl + '" alt="" class="play-icon"></div>';
        $element.prepend(html);
      };

      const setPreview = function (element, settings) {
        const $element = $(element);
        settings.videoId ? setPreviewYouTube($element, settings) : false;
      };

      const parseSettings = function (element) {
        return $(element).data();
      };

      const buildUrl = function (settings) {
        let params = {};
        $.each(settings, function (i, v) {
          switch (i) {
            case 'wmode':
              params[i] = v;
              break;

            case 'autoplay':
              params[i] = v;
              break;

            case 'loop':
              params[i] = v;
              break;

            case 'playlist':
              params[i] = v;
              break;

            case 'showninfo':
              params[i] = v;
              break;

            case 'controls':
              params[i] = v;
              break;

            case 'autohide':
              params[i] = v;
              break;

            case 'ivLoadPolicy':
              params['iv_load_policy'] = v;
              break;
          }
        });
        return '?' + $.param(params);
      };

      $('.youtube-optimized')
        .once('youtube-optimized')
        .each(function (index, element) {
          const settings = parseSettings(element);
          buildUrl(settings);
          setPreview(element, settings);
          $(element).on('click', function () {
            replace(element, settings);
          });
        });
    }
  };

})(jQuery, Drupal);