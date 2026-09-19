(function () {

    /* ===== Lightbox factory (для дипломов) ===== */
    function makeLightbox(modalId, overlayId, closeId, trackId, prevId, nextId, counterId) {
        var modal    = document.getElementById(modalId);
        var overlay  = document.getElementById(overlayId);
        var closeBtn = document.getElementById(closeId);
        var track    = document.getElementById(trackId);
        var prevBtn  = document.getElementById(prevId);
        var nextBtn  = document.getElementById(nextId);
        var counter  = document.getElementById(counterId);
        if (!modal || !track) return { open: function () {}, close: function () {} };

        var slides  = track.querySelectorAll('.md-lightbox__slide');
        var total   = slides.length;
        var current = 0;

        function updateUI() {
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            if (counter) counter.textContent = (current + 1) + ' / ' + total;
            if (prevBtn) prevBtn.disabled = current === 0;
            if (nextBtn) nextBtn.disabled = current === total - 1;
        }
        function open()  { current = 0; updateUI(); modal.classList.add('active');    document.body.style.overflow = 'hidden'; }
        function close() { modal.classList.remove('active'); document.body.style.overflow = ''; }

        if (overlay)  overlay.addEventListener('click', close);
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (prevBtn)  prevBtn.addEventListener('click', function () { if (current > 0) { current--; updateUI(); } });
        if (nextBtn)  nextBtn.addEventListener('click', function () { if (current < total - 1) { current++; updateUI(); } });

        document.addEventListener('keydown', function (e) {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft'  && current > 0)          { current--; updateUI(); }
            if (e.key === 'ArrowRight' && current < total - 1)  { current++; updateUI(); }
        });

        updateUI();
        return { open: open, close: close };
    }

    /* ===== Дипломы ===== */
    var certLB = makeLightbox('mdCertModal', 'mdCertOverlay', 'mdCertClose', 'mdCertTrack', 'mdCertPrev', 'mdCertNext', 'mdCertCounter');

    /* ===== Profile Tabs + Achievements Modal ===== */
    var tabEducation    = document.getElementById('mdTabEducation');
    var tabAchievements = document.getElementById('mdTabAchievements');
    var achModal        = document.getElementById('mdAchievementsModal');
    var achOverlay      = document.getElementById('mdAchievementsOverlay');
    var achClose        = document.getElementById('mdAchievementsClose');
    var achList         = document.getElementById('mdAchievementsList');
    var achTrack        = document.getElementById('mdAchievementGalleryTrack');
    var achPrev         = document.getElementById('mdAchievementGalleryPrev');
    var achNext         = document.getElementById('mdAchievementGalleryNext');
    var achCurrentImg   = document.getElementById('mdAchievementCurrentImg');
    var achTotalImg     = document.getElementById('mdAchievementTotalImg');

    var achievementData = [
        { images: 5 }, { images: 5 }, { images: 5 }, { images: 5 },
        { images: 5 }, { images: 5 }, { images: 5 }, { images: 5 }
    ];
    var achItems   = achList ? achList.querySelectorAll('.md-achievements-modal__list-item') : [];
    var currentAch = 0;
    var currentImg = 0;

    function updateGallery() {
        var totalImages = achievementData[currentAch].images;
        achTrack.style.transform = 'translateX(-' + (currentImg * 100) + '%)';
        achCurrentImg.textContent = currentImg + 1;
        achTotalImg.textContent = totalImages;
        achPrev.disabled = currentImg === 0;
        achNext.disabled = currentImg === totalImages - 1;
    }

    function selectAchievement(idx) {
        for (var i = 0; i < achItems.length; i++) achItems[i].classList.remove('active');
        achItems[idx].classList.add('active');
        currentAch = idx;
        currentImg = 0;
        updateGallery();
    }

    for (var ai = 0; ai < achItems.length; ai++) {
        (function (item, idx) { item.addEventListener('click', function () { selectAchievement(idx); }); })(achItems[ai], ai);
    }

    if (achPrev) achPrev.addEventListener('click', function () { if (currentImg > 0) { currentImg--; updateGallery(); } });
    if (achNext) achNext.addEventListener('click', function () { if (currentImg < achievementData[currentAch].images - 1) { currentImg++; updateGallery(); } });

    function openAchievements() {
        currentAch = 0;
        currentImg = 0;
        selectAchievement(0);
        achModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeAchievements() {
        achModal.classList.remove('active');
        document.body.style.overflow = '';
        tabEducation.classList.add('active');
        tabAchievements.classList.remove('active');
    }

    if (achOverlay) achOverlay.addEventListener('click', closeAchievements);
    if (achClose)   achClose.addEventListener('click', closeAchievements);

    document.addEventListener('keydown', function (e) {
        if (!achModal || !achModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeAchievements();
        if (e.key === 'ArrowLeft'  && currentImg > 0) { currentImg--; updateGallery(); }
        if (e.key === 'ArrowRight' && currentImg < achievementData[currentAch].images - 1) { currentImg++; updateGallery(); }
    });

    if (tabEducation) {
        tabEducation.addEventListener('click', function () {
            tabEducation.classList.add('active');
            tabAchievements.classList.remove('active');
            certLB.open();
        });
    }
    if (tabAchievements) {
        tabAchievements.addEventListener('click', function () {
            tabAchievements.classList.add('active');
            tabEducation.classList.remove('active');
            openAchievements();
        });
    }

    updateGallery();

    /* ===== Результаты подопечных: один клиент + 2 мини-карусели ===== */
    var reviewModal   = document.getElementById('mdReviewModal');
    var reviewOverlay = document.getElementById('mdReviewOverlay');
    var reviewClose   = document.getElementById('mdReviewClose');
    var reviewItems   = document.querySelectorAll('.md-review-item');
    var reviewPrev    = document.getElementById('mdReviewPrev');
    var reviewNext    = document.getElementById('mdReviewNext');
    var reviewCounter = document.getElementById('mdReviewCounter');
    var reviewOpenBtn = document.getElementById('mdOpenReviews');
    var totalClients  = reviewItems.length;
    var currentClient = 0;

    function updateReviewUI() {
        for (var i = 0; i < reviewItems.length; i++) {
            reviewItems[i].classList.toggle('active', i === currentClient);
        }
        if (reviewCounter) reviewCounter.textContent = (currentClient + 1) + ' / ' + totalClients;
        if (reviewPrev) reviewPrev.disabled = currentClient === 0;
        if (reviewNext) reviewNext.disabled = currentClient === totalClients - 1;
    }

    function openReview() {
        currentClient = 0;
        updateReviewUI();
        reviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeReview() {
        reviewModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (reviewOverlay) reviewOverlay.addEventListener('click', closeReview);
    if (reviewClose)   reviewClose.addEventListener('click', closeReview);
    if (reviewPrev)    reviewPrev.addEventListener('click', function () {
        if (currentClient > 0) { currentClient--; updateReviewUI(); }
    });
    if (reviewNext)    reviewNext.addEventListener('click', function () {
        if (currentClient < totalClients - 1) { currentClient++; updateReviewUI(); }
    });
    if (reviewOpenBtn) reviewOpenBtn.addEventListener('click', openReview);

    document.addEventListener('keydown', function (e) {
        if (!reviewModal || !reviewModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeReview();
        if (e.key === 'ArrowLeft'  && currentClient > 0)                { currentClient--; updateReviewUI(); }
        if (e.key === 'ArrowRight' && currentClient < totalClients - 1) { currentClient++; updateReviewUI(); }
    });

    /* ===== Мини-карусели внутри результатов ===== */
    var allTracks = document.querySelectorAll('.md-review-carousel__track');
    for (var ti = 0; ti < allTracks.length; ti++) {
        (function (track) {
            var dots = track.parentElement.querySelectorAll('.md-review-carousel__dot');
            for (var di = 0; di < dots.length; di++) {
                (function (dot, idx) {
                    dot.addEventListener('click', function () {
                        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
                        for (var k = 0; k < dots.length; k++) dots[k].classList.remove('active');
                        dot.classList.add('active');
                    });
                })(dots[di], di);
            }
        })(allTracks[ti]);
    }

    updateReviewUI();

    /* ===== Отзывы: пагинация ===== */
    var reviewsPages            = document.querySelectorAll('.md-reviews-page');
    var reviewsPageBtns         = document.querySelectorAll('.md-reviews-pagination__btn[data-page]');
    var reviewsPrevBtn          = document.getElementById('mdReviewsPrev');
    var reviewsNextBtn          = document.getElementById('mdReviewsNext');
    var secBodyClientReviews    = document.getElementById('secBodyClientReviews');
    var secTriggerClientReviews = document.getElementById('secTriggerClientReviews');
    var totalReviewsPages  = reviewsPages.length;
    var currentReviewsPage = 0;

    function showReviewsPage(page) {
        if (page < 0 || page >= totalReviewsPages) return;
        currentReviewsPage = page;
        for (var rp = 0; rp < reviewsPages.length; rp++) {
            reviewsPages[rp].classList.toggle('active', rp === page);
        }
        for (var rb = 0; rb < reviewsPageBtns.length; rb++) {
            reviewsPageBtns[rb].classList.toggle(
                'active',
                parseInt(reviewsPageBtns[rb].getAttribute('data-page'), 10) === page
            );
        }
        if (reviewsPrevBtn) reviewsPrevBtn.disabled = page === 0;
        if (reviewsNextBtn) reviewsNextBtn.disabled = page === totalReviewsPages - 1;
        if (secBodyClientReviews && secTriggerClientReviews &&
            secTriggerClientReviews.getAttribute('aria-expanded') === 'true') {
            secBodyClientReviews.style.maxHeight = 'none';
        }
    }

    if (reviewsPrevBtn) reviewsPrevBtn.addEventListener('click', function () { showReviewsPage(currentReviewsPage - 1); });
    if (reviewsNextBtn) reviewsNextBtn.addEventListener('click', function () { showReviewsPage(currentReviewsPage + 1); });
    for (var rpb = 0; rpb < reviewsPageBtns.length; rpb++) {
        (function (btn) {
            btn.addEventListener('click', function () {
                showReviewsPage(parseInt(btn.getAttribute('data-page'), 10));
            });
        })(reviewsPageBtns[rpb]);
    }
    showReviewsPage(0);

    /* ===== Section collapse ===== */
    var secTriggers = document.querySelectorAll('.md-sec__trigger');
    function initSecBody(body) { body.style.maxHeight = body.scrollHeight + 'px'; }
    function toggleSec(trigger) {
        var body   = document.getElementById(trigger.getAttribute('aria-controls'));
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            body.style.maxHeight = body.scrollHeight + 'px';
            body.offsetHeight;
            body.classList.add('collapsed');
            trigger.setAttribute('aria-expanded', 'false');
        } else {
            body.classList.remove('collapsed');
            body.style.maxHeight = body.scrollHeight + 'px';
            trigger.setAttribute('aria-expanded', 'true');
            body.addEventListener('transitionend', function onEnd() {
                if (trigger.getAttribute('aria-expanded') === 'true') body.style.maxHeight = 'none';
                body.removeEventListener('transitionend', onEnd);
            });
        }
    }
    for (var i = 0; i < secTriggers.length; i++) {
        initSecBody(document.getElementById(secTriggers[i].getAttribute('aria-controls')));
        secTriggers[i].addEventListener('click', (function (t) { return function () { toggleSec(t); }; })(secTriggers[i]));
    }

    /* ===== Mobile Menu ===== */
    var menuBtn  = document.getElementById('mdMenuBtn');
    var menu     = document.getElementById('mdMenu');
    var overlay  = document.getElementById('mdOverlay');
    var closeBtn = document.getElementById('mdMenuClose');
    function openMenu()  { menu.classList.add('active');    overlay.classList.add('active');    document.body.style.overflow = 'hidden'; }
    function closeMenu() { menu.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = ''; }
    if (menuBtn)  menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay)  overlay.addEventListener('click', closeMenu);
    var menuLinks = document.querySelectorAll('#mdMenuLink, #mdMenuLink2, #mdMenuLink3, #mdMenuLink4');
    for (var m = 0; m < menuLinks.length; m++) menuLinks[m].addEventListener('click', closeMenu);

    /* ===== Tabs тарифов ===== */
    var tabBtns = document.querySelectorAll('.md-tabs__btn');
    var panels  = document.querySelectorAll('.md-tabs__panel');
    function switchTab(btn) {
        for (var a = 0; a < tabBtns.length; a++) tabBtns[a].setAttribute('aria-selected', 'false');
        for (var b = 0; b < panels.length; b++)  panels[b].classList.remove('active');
        btn.setAttribute('aria-selected', 'true');
        var target = document.getElementById(btn.getAttribute('aria-controls'));
        if (target) target.classList.add('active');
        var sb = document.getElementById('secBodyTarif');
        if (sb && document.getElementById('secTriggerTarif').getAttribute('aria-expanded') === 'true') sb.style.maxHeight = 'none';
    }
    for (var k = 0; k < tabBtns.length; k++) tabBtns[k].addEventListener('click', (function (b) { return function () { switchTab(b); }; })(tabBtns[k]));

    /* ===== FAQ-аккордеон ===== */
    var accTriggers = document.querySelectorAll('.md-accordion__trigger');
    for (var t = 0; t < accTriggers.length; t++) {
        accTriggers[t].addEventListener('click', function () {
            var item   = this.parentElement;
            var body   = item.querySelector('.md-accordion__body');
            var isOpen = item.classList.contains('open');
            if (isOpen) {
                item.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
                body.style.maxHeight = '0';
            } else {
                item.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + 'px';
                var sb = document.getElementById('secBodyFaq');
                if (sb) sb.style.maxHeight = 'none';
            }
        });
    }

    /* ===== Smooth scroll ===== */
    var allLinks = document.querySelectorAll('a[href^="#"]');
    for (var s = 0; s < allLinks.length; s++) {
        allLinks[s].addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id && id.length > 1) {
                var el = document.querySelector(id);
                if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            }
        });
    }

})();