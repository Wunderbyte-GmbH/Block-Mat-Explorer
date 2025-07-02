import Notification from "core/notification";
import $ from "jquery";

export const courseCardTemplate = (values) => {
  const elementDefinition = `
  <div class="card mat-card ${values.userEnrolled ? 'to-course' : 'enrol-into-course'}" data-id="${values.id}" tabindex="0">
      ${courseCardFrontTemplate(values)}
  </div>`;
  const element = $(elementDefinition);

  // Handling course enrolment after clicking on primary card action button
    const clickHandler = function() {
        let url;
        if (values.userEnrolled) {
            url = '/course/view.php?id=' + values.id;
            window.location.href = window.location.href.replace(window.location.pathname, url);
        } else {
            url = '/blocks/course_explorer/ajax/enrol_user_into_course.php?courseid=' + values.id;
            fetch(url, {
                method: "GET",
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.enrolled) {
                        url = '/course/view.php?id=' + values.id;
                        window.location.href = window.location.href.replace(window.location.pathname, url);
                    } else {
                        Notification.alert('Error', result.errormessage, 'Close');
                    }
                    return console.log(result);
                })
                .catch((error) => console.log(error));
        }
    };
    element.click(clickHandler);
    element.keyup((event) => {
        if (event.originalEvent instanceof KeyboardEvent
            && event.key.toLocaleLowerCase() !== 'enter') {
            return;
        }
        clickHandler();
    });

  return element;
};

const truncateString = (str, length) => {
    if (str.length <= length) {
        return str; // Return the original string if it's already within or equal to 100 characters
    } else {
        return str.slice(0, length) + '...'; // Cut the string at 100 characters and add an ellipsis
    }
};

const getDesc = (description) => {
    if (description.trim() !== '') {
        return description;
    } else {
        return "lorem ipsum dolor sit amet, consectetur adipiscing elit." +
            " lorem ipsum dolor sit amet, consectetur adipiscing elit." +
            " lorem ipsum dolor sit amet, consectetur adipiscing elit." +
            " lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    }
};

const courseCardFrontTemplate = (
    {
        title,
        MCOriginal,
        image,
        description,
        score,
        reviewsnum,
        senderName,
        courseType,
        duration,
        topics,
        favourite,
        ma_art1,
        ma_art2,
    }
) => {
    title = truncateString(title, 100);
    let courseCardDescription = getDesc(description);
    courseCardDescription = truncateString(courseCardDescription, 150);

    topics = topics?.map(topic => topic.value);
    const heartIconName = favourite ? "heart-filled.png" : "heart-outline.png";
    const svgMatIcon = `
    <div class="icon-container mr-3 has-icon-color has-custom-mc-lila-color" style="color:#551c77;width:20px;transform:rotate(0deg) scaleX(1) scaleY(1)">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
        <path d="M12,111l112,64a8,8,0,0,0,7.94,0l112-64a8,8,0,0,0,0-13.9l-112-64a8,8,0,0,0-7.94,0l-112,64A8,8,0,0,0,12,111ZM128,49.21L223.87,104 128,158.79 32.13,104ZM246.94,140A8,8,0,0,1,244,151L132,215a8,8,0,0,1-7.94,0L12,151A8,8,0,0,1,20,137.05l108,61.74 108-61.74A8,8,0,0,1,246.94,140Z"></path>
        </svg>
    </div>
    `;

    return `
          <div class="position-relative card-header p-0">
            ${image ? `<img src="${image}" class="card-img-top" alt="">` : `<img src="https://picsum.photos/2124" class="card-img-top" alt="">`}
            ${MCOriginal ? "<div class=\"course-card__label mc-original\">MC-Original</div>" : ""}
            <div class="d-flex flex-wrap text-muted mb-2 small rating">
              <div class="d-flex align-items-center">
                ${getRating(score, reviewsnum)}
              </div>
            </div>
        </div>
          <div class="card-body">
            <div>
                <span class="course-type">${courseType}</span>
                <h2 class="course-title">${title}</h5>
                <p class="card-text mb-1 sender">${senderName}</p>
            </div>
            <div class="mr-3 d-flex align-items-center duration">
                ${svgMatIcon}
                <div>${ma_art1}${ma_art2 ? ', ' + ma_art2 : ''}</div>
            </div>
          </div>
    `;
};

const getRating = (score, reviewsnum) => {
    reviewsnum = reviewsnum ?? 0;
    let firstStarClass = 'fa-star-o';
    let secondStarClass = 'fa-star-o';
    let thirdStarClass = 'fa-star-o';
    if (score) {
        score = score * (3 / 5);
        if (score < 0.75) {
            firstStarClass = 'fa-star-half-o';
        } else if (score < 1.25) {
            firstStarClass = 'fa-star';
        } else if (score < 1.75) {
            firstStarClass = 'fa-star';
            secondStarClass = 'fa-star-half-o';
        } else if (score < 2.25) {
            firstStarClass = 'fa-star';
            secondStarClass = 'fa-star';
        } else if (score < 2.75) {
            firstStarClass = 'fa-star';
            secondStarClass = 'fa-star';
            thirdStarClass = 'fa-star-half-o';
        } else {
            firstStarClass = 'fa-star';
            secondStarClass = 'fa-star';
            thirdStarClass = 'fa-star';
        }
    }

    return `<i class="fa ${firstStarClass}"></i>
            <i class="fa ${secondStarClass}"></i>
            <i class="fa ${thirdStarClass} mr-1"></i>
            <span>(${reviewsnum})</span>`;
};