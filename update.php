<?
/* ================================
 * Calliope
 * Shows public transit arrivals with big-ass numbers
 * by Aaron Draczynski
 * ================================
 * http://www.papermodelplane.com/
 * http://twitter.com/developer
 * ================================
 */

// Include library for transit API
include 'muni.php';

$request = new NextMuni;
$request->agency = 'sf-muni';
$request->stops  = array('N|7318', 'J|4006', '71|4951');
$response = $request->predictions_multiple()->predictions;

$response = json_encode($response);
print $response;
