import Capacitor
import UIKit

// The viewport meta tag alone isn't always enough to kill pinch/double-tap
// zoom on WKWebView, so this disables it natively too.
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        lockZoom()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        lockZoom()
    }

    /// WKWebView re-derives the scroll view's zoom limits from the page's
    /// viewport meta *after* capacitorDidLoad has run, so clamping once at
    /// startup does not hold — which is what left double-tap able to zoom in
    /// while the pinch that would undo it stayed disabled. Re-asserting on
    /// every layout pass is what actually keeps both off.
    private func lockZoom() {
        guard let scrollView = webView?.scrollView else { return }
        scrollView.pinchGestureRecognizer?.isEnabled = false
        scrollView.minimumZoomScale = 1.0
        scrollView.maximumZoomScale = 1.0
        scrollView.bouncesZoom = false
        if scrollView.zoomScale != 1.0 {
            scrollView.setZoomScale(1.0, animated: false)
        }
        disableDoubleTap(in: scrollView)
    }

    /// Double-tap "smart zoom" is a separate recogniser from pinch and is not
    /// exposed on any public property, so the only way to reach it is to walk
    /// the view tree the web content is hosted in. WKWebView installs it
    /// lazily on the content view, hence the repeat visits from lockZoom().
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
