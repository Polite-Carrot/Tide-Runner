import Capacitor
import UIKit

/// Returning no view to zoom is the one refusal UIKit honours unconditionally:
/// with nothing to scale, the scroll view cannot zoom by any route — pinch,
/// double-tap smart zoom, or anything else that asks. Everything else is a
/// gesture-by-gesture argument that has to be won every time.
private final class NoZoomScrollDelegate: NSObject, UIScrollViewDelegate {
    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
        return nil
    }
}

/// The viewport meta tag alone isn't enough to kill pinch/double-tap zoom on
/// WKWebView — iOS has ignored user-scalable=no since iOS 10 — so this
/// disables it natively too.
class MainViewController: CAPBridgeViewController {
    /// UIScrollView holds its delegate weakly, so it has to be owned here or
    /// it would be released and the scroll view would fall back to no
    /// delegate at all.
    private let noZoom = NoZoomScrollDelegate()

    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        lockZoom()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        lockZoom()
    }

    /// Capacitor's own "zooming disabled" handling is a single delegate
    /// method that switches the pinch recogniser off once zooming has already
    /// begun. Double-tap smart zoom is not a pinch, so it sails straight past
    /// that, completes its scale change, and leaves pinch — the only way back
    /// out — disabled behind it. That is the whole zoom-in-but-never-out bug.
    ///
    /// Taking the delegate over stops zooming ever beginning, so that method
    /// never runs and pinch is never sacrificed. Capacitor implements exactly
    /// one scroll view method, the one superseded here, so nothing else of
    /// its behaviour is lost. The rest is defence in depth for anything that
    /// reaches the scroll view by another path.
    private func lockZoom() {
        guard let scrollView = webView?.scrollView else { return }

        scrollView.delegate = noZoom
        scrollView.pinchGestureRecognizer?.isEnabled = false
        scrollView.minimumZoomScale = 1.0
        scrollView.maximumZoomScale = 1.0
        scrollView.bouncesZoom = false
        if scrollView.zoomScale != 1.0 {
            scrollView.setZoomScale(1.0, animated: false)
        }
        disableDoubleTap(in: scrollView)
    }

    /// The double-tap recognisers are not exposed on any public property, so
    /// the only way to reach them is to walk the view tree the web content is
    /// hosted in. WKWebView installs them lazily on the content view, hence
    /// the repeat visits from lockZoom().
    private func disableDoubleTap(in view: UIView) {
        for recognizer in view.gestureRecognizers ?? [] {
            if let tap = recognizer as? UITapGestureRecognizer,
                tap.numberOfTapsRequired == 2
            {
                tap.isEnabled = false
            }
        }
        for subview in view.subviews {
            disableDoubleTap(in: subview)
        }
    }
}
